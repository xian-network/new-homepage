const TIMEOUT_MS = 3000;
let pyodideReadyPromise = null;
let pyodide = null;
let runtimeApi = {};
let currentExample = null;

const RUNTIME_SOURCE = `
import math
from types import SimpleNamespace

SAFE_BUILTINS = {
    'abs': abs,
    'min': min,
    'max': max,
    'sum': sum,
    'round': round,
    'pow': pow,
    'range': range,
    'len': len,
    'enumerate': enumerate,
    'zip': zip,
    'sorted': sorted,
    'reversed': reversed,
    'all': all,
    'any': any,
    'bool': bool,
    'int': int,
    'float': float,
    'str': str,
    'dict': dict,
    'list': list,
    'set': set,
    'tuple': tuple,
    'type': type,
    'isinstance': isinstance,
    'getattr': getattr,
    'hasattr': hasattr,
    'Exception': Exception,
    'ValueError': ValueError,
    'TypeError': TypeError,
    'AssertionError': AssertionError,
};

runtime_logs = []

def _print(*args, **kwargs):
    message = ' '.join(str(a) for a in args)
    runtime_logs.append({'type': 'print', 'message': message})

SAFE_BUILTINS['print'] = _print

def to_native(value):
    if value is None:
        return None
    if isinstance(value, (str, int, float, bool)):
        return value
    if hasattr(value, 'to_py'):
        try:
            value = value.to_py()
        except TypeError:
            try:
                value = value.to_py(dict_converter=dict)
            except TypeError:
                pass
    if isinstance(value, dict):
        return {key: to_native(val) for key, val in value.items()}
    if isinstance(value, list):
        return [to_native(item) for item in value]
    if isinstance(value, tuple):
        return tuple(to_native(item) for item in value)
    return value

class State(dict):
    def get(self, key, default=None):
        return super().get(key, default)

    def set(self, key, value):
        self[key] = value

class Hash:
    def __init__(self, default_value=None):
        self._storage = {}
        self.default_value = default_value

    def __getitem__(self, key):
        return self._storage.get(key, self.default_value)

    def __setitem__(self, key, value):
        self._storage[key] = value

    def __delitem__(self, key):
        del self._storage[key]

    def items(self):
        return self._storage.items()

    def clear(self):
        self._storage.clear()

    def snapshot(self):
        return {
            'type': 'Hash',
            'default': self.default_value,
            'items': [[key, self._storage[key]] for key in self._storage],
        }

    def restore(self, data):
        self._storage.clear()
        if not data:
            return
        self.default_value = data.get('default', self.default_value)
        for key, value in data.get('items', []):
            self._storage[key] = value

class CurrencyStub:
    def __init__(self):
        self.reset()

    def reset(self):
        self.balances = {}
        self.approvals = {}

    def snapshot(self):
        return {
            'balances': [[account, amount] for account, amount in self.balances.items()],
            'approvals': [[list(pair), amount] for pair, amount in self.approvals.items()],
        }

    def restore(self, snap):
        self.reset()
        if not snap:
            return
        for account, amount in snap.get('balances', []):
            self.balances[account] = amount
        for pair, amount in snap.get('approvals', []):
            if isinstance(pair, (list, tuple)) and len(pair) == 2:
                self.approvals[(pair[0], pair[1])] = amount

    def _ensure_account(self, account):
        if account not in self.balances:
            self.balances[account] = 0

    def balance_of(self, account):
        return self.balances.get(account, 0)

    def mint(self, amount: float, to: str):
        self._ensure_account(to)
        self.balances[to] += amount

    def approve(self, amount: float, to: str, signer: str):
        self.approvals[(signer, to)] = amount

    def transfer(self, amount: float, to: str):
        source = ctx.this
        if self.balances.get(source, 0) < amount:
            raise AssertionError('currency: insufficient funds')
        self.balances[source] -= amount
        self._ensure_account(to)
        self.balances[to] += amount

    def transfer_from(self, amount: float, to: str, main_account: str):
        spender = ctx.this
        allowed = self.approvals.get((main_account, spender), 0)
        if allowed < amount:
            raise AssertionError('not approved')
        if self.balances.get(main_account, 0) < amount:
            raise AssertionError('insufficient funds')
        self.approvals[(main_account, spender)] = allowed - amount
        self.balances[main_account] -= amount
        self._ensure_account(to)
        self.balances[to] += amount

currency = CurrencyStub()
ctx = SimpleNamespace(caller='alice', signer='alice', this='con_safe')


def _import(name, globals=None, locals=None, fromlist=(), level=0):
    if level not in (0, None):
        raise ImportError('relative imports are not allowed')

    target = (name or '').split('.', 1)[0]
    allowed = {
        'currency': currency,
        'math': math,
    }

    if target in allowed:
        return allowed[target]

    raise ImportError(f"import of '{name}' is not permitted")


SAFE_BUILTINS['__import__'] = _import

exports = {}
constructors = []
state = State()
contract_globals = {}
current_source = ''
current_name = 'contract'
init_kwargs_cache = {}


def export(fn):
    exports[fn.__name__] = fn
    return fn


def variable(fn):
    return fn


def construct(fn):
    constructors.append(fn)
    return fn


def reset_logs():
    runtime_logs.clear()


def serialize_state():
    result = {
        'contract': {},
        'runtime': {
            'currency': currency.snapshot(),
            'state': [[key, value] for key, value in state.items()],
        },
    }
    for name, value in contract_globals.items():
        if isinstance(value, Hash):
            result['contract'][name] = value.snapshot()
    return result


def restore_state(snapshot):
    snapshot = to_native(snapshot)
    if not snapshot or not isinstance(snapshot, dict):
        return
    contract_snapshot = snapshot.get('contract', {})
    for name, data in contract_snapshot.items():
        target = contract_globals.get(name)
        if isinstance(target, Hash):
            target.restore(data)
    runtime_snapshot = snapshot.get('runtime', {})
    currency.restore(runtime_snapshot.get('currency'))
    state.clear()
    for key, value in runtime_snapshot.get('state', []):
        state[key] = value


def prepare_context(payload=None):
    payload = to_native(payload) or {}
    ctx.caller = payload.get('caller', 'alice')
    ctx.signer = payload.get('signer', ctx.caller)
    ctx.this = payload.get('this', current_name)


def runtime_load(source, contract_name, snapshot=None, init_kwargs=None):
    global current_source, current_name, init_kwargs_cache
    current_source = source
    current_name = contract_name or 'contract'
    init_kwargs_cache = to_native(init_kwargs) or {}
    exports.clear()
    constructors.clear()
    contract_globals.clear()
    state.clear()
    reset_logs()
    currency.reset()
    prepare_context({'caller': 'system', 'signer': 'system', 'this': current_name})
    env = {
        '__builtins__': SAFE_BUILTINS,
        'Hash': Hash,
        'State': State,
        'state': state,
        'ctx': ctx,
        'currency': currency,
        'export': export,
        'variable': variable,
        'construct': construct,
    }
    exec(source, env)
    contract_globals.update(env)
    for name, value in env.items():
        if isinstance(value, Hash):
            value.__xp_name__ = name
    if snapshot:
        restore_state(snapshot)
    if constructors:
        kwargs = init_kwargs_cache or {}
        for fn in constructors:
            fn(**kwargs)
    return serialize_state()


def runtime_call(fn_name, kwargs=None, context=None):
    reset_logs()
    kwargs = to_native(kwargs) or {}
    context = to_native(context) or {}
    prepare_context(context)
    if fn_name not in exports:
        raise KeyError(f'Function {fn_name} is not exported')
    runtime_logs.append({'type': 'call', 'message': f"{fn_name}({kwargs})"})
    result = exports[fn_name](**kwargs)
    runtime_logs.append({'type': 'return', 'message': repr(result)})
    snapshot = serialize_state()
    return {
        'result': result,
        'logs': list(runtime_logs),
        'state': snapshot,
    }


def runtime_read_state():
    reset_logs()
    return {'state': serialize_state(), 'logs': list(runtime_logs)}


def runtime_apply_snapshot(snapshot):
    restore_state(snapshot)
    return serialize_state()
`;

function clone(value) {
  if (value === null || value === undefined) {
    return value;
  }
  return JSON.parse(JSON.stringify(value));
}

async function ensurePyodide() {
  if (!pyodideReadyPromise) {
    pyodideReadyPromise = (async () => {
      importScripts('https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js');
      const instance = await loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      return instance;
    })();
  }
  if (!pyodide) {
    pyodide = await pyodideReadyPromise;
  } else {
    await pyodideReadyPromise;
  }
  return pyodide;
}

async function ensureRuntime() {
  await ensurePyodide();
  if (!runtimeApi.load) {
    await pyodide.runPythonAsync(RUNTIME_SOURCE);
    runtimeApi = {
      load: pyodide.globals.get('runtime_load'),
      call: pyodide.globals.get('runtime_call'),
      readState: pyodide.globals.get('runtime_read_state'),
      applySnapshot: pyodide.globals.get('runtime_apply_snapshot'),
    };
  }
}

function toJs(result) {
  if (!result) {
    return result;
  }
  if (typeof result.toJs === 'function') {
    const converted = result.toJs({ create_proxies: false });
    if (typeof result.destroy === 'function') {
      result.destroy();
    }
    return converted;
  }
  return result;
}

function normalizeError(error) {
  if (!error) {
    return { message: 'Unknown error' };
  }
  if (typeof error === 'string') {
    return { message: error };
  }
  return {
    message: error.message || 'Unknown error',
    name: error.name,
    stack: error.stack,
  };
}

function respondOk(id, data) {
  postMessage({ id, status: 'ok', data });
}

function respondError(id, error) {
  postMessage({ id, status: 'error', error: normalizeError(error) });
}

function respondTimeout(id) {
  postMessage({
    id,
    status: 'timeout',
    error: { message: 'Execution timed out. The sandbox was reset.' },
  });
  try {
    if (runtimeApi.load) {
      Object.values(runtimeApi).forEach((value) => {
        if (value && typeof value.destroy === 'function') {
          value.destroy();
        }
      });
    }
  } catch (err) {
    // ignore cleanup errors
  }
  runtimeApi = {};
  currentExample = null;
  try {
    if (pyodide && typeof pyodide.destroy === 'function') {
      pyodide.destroy();
    }
  } catch (err) {
    // ignore
  }
  pyodide = null;
  pyodideReadyPromise = null;
  close();
}

async function handleLoad(payload) {
  await ensureRuntime();
  const exampleId = payload.exampleId || 'example';
  const code = payload.code || '';
  const contractName = payload.contractName || 'contract';
  const baseState = clone(payload.baseState || null);
  const restoreState = payload.hasOwnProperty('restoreState') ? clone(payload.restoreState) : clone(baseState);
  const initKwargs = payload.initKwargs || {};
  currentExample = { id: exampleId, code, contractName, baseState, initKwargs };
  const result = toJs(runtimeApi.load(code, contractName, restoreState, initKwargs));
  return { state: result };
}

async function handleCall(payload) {
  await ensureRuntime();
  if (!currentExample) {
    throw new Error('Example not loaded yet');
  }
  const fnName = payload.functionName;
  if (!fnName) {
    throw new Error('Function name is required');
  }
  const kwargs = payload.kwargs || {};
  const context = payload.context || {};
  const result = toJs(runtimeApi.call(fnName, kwargs, context));
  return result;
}

async function handleReadState() {
  await ensureRuntime();
  if (!currentExample) {
    throw new Error('Example not loaded yet');
  }
  const result = toJs(runtimeApi.readState());
  return result;
}

async function handleReset(payload) {
  await ensureRuntime();
  if (!currentExample) {
    throw new Error('Example not loaded yet');
  }
  const overrideState = payload && payload.restoreState !== undefined ? clone(payload.restoreState) : null;
  const snapshot = overrideState !== null ? overrideState : clone(currentExample.baseState);
  const initKwargs = payload && payload.initKwargs ? payload.initKwargs : currentExample.initKwargs || {};
  const result = toJs(runtimeApi.load(currentExample.code, currentExample.contractName, snapshot, initKwargs));
  return { state: result };
}

async function dispatchMessage(type, payload) {
  switch (type) {
    case 'load':
      return handleLoad(payload);
    case 'call':
      return handleCall(payload);
    case 'read_state':
      return handleReadState();
    case 'reset':
      return handleReset(payload || {});
    default:
      throw new Error(`Unknown message type: ${type}`);
  }
}

self.onmessage = function onmessage(event) {
  const { id, type, payload } = event.data || {};
  if (!id) {
    return;
  }
  let finished = false;
  const timer = setTimeout(() => {
    if (!finished) {
      respondTimeout(id);
    }
  }, TIMEOUT_MS);

  (async () => {
    try {
      const data = await dispatchMessage(type, payload || {});
      finished = true;
      clearTimeout(timer);
      respondOk(id, data);
    } catch (error) {
      if (!finished) {
        finished = true;
        clearTimeout(timer);
        respondError(id, error);
      }
    }
  })();
};
