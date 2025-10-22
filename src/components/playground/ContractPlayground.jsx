import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const CONTRACT_SOURCE = `import currency  # currency is the network's main token

safe = Hash(default_value=0)

@export
def deposit(amount: float):
    currency.transfer_from(
        amount=amount,
        to=ctx.this,
        main_account=ctx.caller,
    )
    safe[ctx.caller] += amount

@export
def withdraw(amount: float):
    assert safe[ctx.caller] >= amount, 'insufficient funds'
    currency.transfer(amount=amount, to=ctx.caller)
    safe[ctx.caller] -= amount

@export
def get_balance(account: str):
    return safe[account]
`;

const CONTRACT_CODE_HTML = `
<span class="py-keyword">import</span> <span class="py-builtin">currency</span><span class="py-comment">  # currency is the network's main token</span>

<span class="py-identifier">safe</span> = <span class="py-builtin">Hash</span>(default_value=<span class="py-number">0</span>)

<span class="py-decorator">@export</span>
<span class="py-keyword">def</span> <span class="py-identifier">deposit</span>(amount: <span class="py-builtin">float</span>):
    <span class="py-builtin">currency</span>.<span class="py-identifier">transfer_from</span>(
        amount=amount,
        to=<span class="py-builtin">ctx</span>.<span class="py-identifier">this</span>,
        main_account=<span class="py-builtin">ctx</span>.<span class="py-identifier">caller</span>,
    )
    <span class="py-identifier">safe</span>[<span class="py-builtin">ctx</span>.<span class="py-identifier">caller</span>] += amount

<span class="py-decorator">@export</span>
<span class="py-keyword">def</span> <span class="py-identifier">withdraw</span>(amount: <span class="py-builtin">float</span>):
    <span class="py-keyword">assert</span> <span class="py-identifier">safe</span>[<span class="py-builtin">ctx</span>.<span class="py-identifier">caller</span>] >= amount, <span class="py-string">'insufficient funds'</span>
    <span class="py-builtin">currency</span>.<span class="py-identifier">transfer</span>(amount=amount, to=<span class="py-builtin">ctx</span>.<span class="py-identifier">caller</span>)
    <span class="py-identifier">safe</span>[<span class="py-builtin">ctx</span>.<span class="py-identifier">caller</span>] -= amount

<span class="py-decorator">@export</span>
<span class="py-keyword">def</span> <span class="py-identifier">get_balance</span>(account: <span class="py-builtin">str</span>):
    <span class="py-keyword">return</span> <span class="py-identifier">safe</span>[account]
`;

const DEFAULT_BASE_STATE = {
  contract: {
    safe: {
      type: 'Hash',
      default: 0,
      items: [],
    },
  },
  runtime: {
    currency: {
      balances: [
        ['alice', 1000],
        ['con_safe', 0],
      ],
      approvals: [
        [['alice', 'con_safe'], 1000],
      ],
    },
    state: [],
  },
  driver: {
    contract: {
      'currency.balances:alice': 1000,
      'currency.balances:con_safe': 0,
      'currency.approvals:alice:con_safe': 1000,
    },
    runtime: {},
  },
};

const EXAMPLE = {
  id: 'con_safe',
  contractName: 'con_safe',
  title: 'Savings Vault',
  code: CONTRACT_SOURCE,
  codeHtml: CONTRACT_CODE_HTML,
  baseState: DEFAULT_BASE_STATE,
  defaultFunction: 'deposit',
  defaultKwargs: JSON.stringify({ amount: 200, $caller: 'alice' }, null, 2),
  defaultContext: { caller: 'alice', signer: 'alice', this: 'con_safe' },
  initKwargs: {},
};

const DOC_URL = 'https://docs.xian.org/tutorials/your_first_smart_contract';

function splitKwargsInput(raw, defaults) {
  const context = { ...defaults };
  const kwargs = {};
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { context, kwargs };
  }
  Object.entries(raw).forEach(([key, value]) => {
    if (key === '$caller') {
      context.caller = value;
    } else if (key === '$signer') {
      context.signer = value;
    } else if (key === '$this') {
      context.this = value;
    } else {
      kwargs[key] = value;
    }
  });
  return { context, kwargs };
}

function formatResult(result) {
  if (result === null || result === undefined) {
    return 'None';
  }
  if (typeof result === 'object') {
    try {
      return JSON.stringify(result);
    } catch (error) {
      return String(result);
    }
  }
  return String(result);
}

function formatTime(timestamp) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(timestamp);
  } catch (error) {
    return new Date(timestamp).toLocaleTimeString();
  }
}


function cloneState(state) {
  if (state === null || state === undefined) {
    return state;
  }
  return JSON.parse(JSON.stringify(state));
}

function ContractPlayground() {
  const example = EXAMPLE;
  const [functionName, setFunctionName] = useState(example.defaultFunction);
  const [kwargsInput, setKwargsInput] = useState(example.defaultKwargs);
  const [stateSnapshot, setStateSnapshot] = useState(() => cloneState(example.baseState));
  const [logs, setLogs] = useState([]);
  const [isBusy, setIsBusy] = useState(false);
  const [pyReady, setPyReady] = useState(false);

  const workerRef = useRef(null);
  const requestIdRef = useRef(0);
  const pendingRequestsRef = useRef(new Map());
  const hasLoadedRef = useRef(false);
  const baseStateRef = useRef(cloneState(example.baseState));

  const appendLog = useCallback((entry) => {
    setLogs((previous) => {
      const timestamp = Date.now();
      const id = `${timestamp}-${Math.random().toString(16).slice(2)}`;
      const next = [...previous, { id, timestamp, ...entry }];
      if (next.length > 30) {
        next.shift();
      }
      return next;
    });
  }, []);

  const resetWorker = useCallback((reason) => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
    pendingRequestsRef.current.forEach(({ reject }) => {
      reject(new Error(reason || 'Sandbox reset'));
    });
    pendingRequestsRef.current.clear();
    hasLoadedRef.current = false;
    setPyReady(false);
  }, []);

  const handleWorkerMessage = useCallback(
    (event) => {
      const { id, status, data, error } = event.data || {};
      if (!id) {
        return;
      }
      const pending = pendingRequestsRef.current.get(id);
      if (!pending) {
        return;
      }
      pendingRequestsRef.current.delete(id);
      if (status === 'ok') {
        pending.resolve(data);
        return;
      }
      const message = error?.message || 'Sandbox error';
      if (status === 'timeout') {
        pending.reject(new Error(message));
        appendLog({ type: 'error', title: 'Sandbox timeout', message });
        resetWorker(message);
        return;
      }
      pending.reject(new Error(message));
      appendLog({ type: 'error', title: 'Sandbox error', message });
    },
    [appendLog, resetWorker],
  );

  const ensureWorker = useCallback(() => {
    if (workerRef.current || typeof window === 'undefined') {
      return workerRef.current;
    }
    const worker = new Worker(new URL('../../workers/contractWorker.js', import.meta.url));
    worker.onmessage = handleWorkerMessage;
    worker.onerror = (event) => {
      appendLog({ type: 'error', title: 'Worker error', message: event.message || 'Sandbox error' });
      resetWorker(event.message || 'Sandbox error');
    };
    worker.onmessageerror = (event) => {
      appendLog({ type: 'error', title: 'Worker message error', message: event.data || 'Invalid message from sandbox' });
      resetWorker('Worker message error');
    };
    workerRef.current = worker;
    return worker;
  }, [appendLog, handleWorkerMessage, resetWorker]);

  const sendWorkerRequest = useCallback(
    (type, payload) => {
      const worker = ensureWorker();
      if (!worker) {
        return Promise.reject(new Error('Sandbox unavailable'));
      }
      const id = requestIdRef.current + 1;
      requestIdRef.current = id;
      return new Promise((resolve, reject) => {
        pendingRequestsRef.current.set(id, { resolve, reject });
        worker.postMessage({ id, type, payload });
      });
    },
    [ensureWorker],
  );

  const ensureInitialized = useCallback(async () => {
    if (hasLoadedRef.current) {
      return stateSnapshot;
    }
    appendLog({ type: 'info', title: 'Initializing', message: 'Preparing Python sandbox…' });
    const { state } = await sendWorkerRequest('load', {
      exampleId: example.id,
      code: example.code,
      contractName: example.contractName,
      baseState: cloneState(example.baseState),
      restoreState: cloneState(example.baseState),
      initKwargs: example.initKwargs ?? {},
    });
    hasLoadedRef.current = true;
    baseStateRef.current = cloneState(example.baseState);
    setPyReady(true);
    setStateSnapshot(state);
    appendLog({ type: 'info', title: 'Sandbox ready', message: 'Python runtime loaded in your browser.' });
    return state;
  }, [appendLog, example, sendWorkerRequest, stateSnapshot]);

  useEffect(() => {
    setFunctionName(example.defaultFunction);
    setKwargsInput(example.defaultKwargs);
    setStateSnapshot(cloneState(example.baseState));
    setLogs([]);
    hasLoadedRef.current = false;
    baseStateRef.current = cloneState(example.baseState);
  }, [example]);

  useEffect(
    () => () => {
      resetWorker('Component unmounted');
    },
    [resetWorker],
  );

  const handleCall = useCallback(
    async (event) => {
      event?.preventDefault?.();
      if (isBusy) {
        return;
      }
      const trimmedName = functionName.trim();
      if (!trimmedName) {
        appendLog({ type: 'error', title: 'Call failed', message: 'Function name is required.' });
        return;
      }
      let parsedKwargs = {};
      try {
        if (kwargsInput.trim()) {
          parsedKwargs = JSON.parse(kwargsInput);
        }
        if (parsedKwargs && typeof parsedKwargs === 'object' && !Array.isArray(parsedKwargs)) {
          // valid
        } else {
          throw new Error('Kwargs JSON must be an object.');
        }
      } catch (error) {
        appendLog({ type: 'error', title: 'Call failed', message: error.message || 'Invalid kwargs JSON.' });
        return;
      }
      const { context, kwargs } = splitKwargsInput(parsedKwargs, example.defaultContext);
      setIsBusy(true);
      try {
        await ensureInitialized();
        const response = await sendWorkerRequest('call', {
          functionName: trimmedName,
          kwargs,
          context,
        });
        setStateSnapshot(response.state);
        appendLog({
          type: 'success',
          title: `Called ${trimmedName}`,
          message: `Returned ${formatResult(response.result)}`,
          details: JSON.stringify({ kwargs, context }, null, 2),
          pythonLogs: response.logs || [],
        });
      } catch (error) {
        appendLog({ type: 'error', title: `Call ${trimmedName} failed`, message: error.message || 'Execution error.' });
      } finally {
        setIsBusy(false);
      }
    },
    [appendLog, ensureInitialized, example.defaultContext, functionName, isBusy, kwargsInput, sendWorkerRequest],
  );

  const handleReset = useCallback(async () => {
    if (isBusy) {
      return;
    }
    setIsBusy(true);
    try {
      await ensureInitialized();
      const { state } = await sendWorkerRequest('reset', {
        restoreState: cloneState(baseStateRef.current),
        initKwargs: example.initKwargs,
      });
      setStateSnapshot(state);
      appendLog({ type: 'info', title: 'Sandbox reset', message: 'State restored to defaults.' });
    } catch (error) {
      appendLog({ type: 'error', title: 'Reset failed', message: error.message || 'Unable to reset sandbox.' });
    } finally {
      setIsBusy(false);
    }
  }, [appendLog, ensureInitialized, example.initKwargs, isBusy, sendWorkerRequest]);

  const stateText = useMemo(() => {
    try {
      const driverState = stateSnapshot?.driver ?? {};
      return JSON.stringify(driverState, null, 2);
    } catch (error) {
      return 'State unavailable.';
    }
  }, [stateSnapshot]);

  return (
    <div className="contract-example" id="xian-playground">
      <div className="contract-header">
        <h3>Python Contracts in Action</h3>
        <div className="contract-toolbar">
          <button
            className="toggle-code"
            id="toggle-code"
            type="button"
            aria-haspopup="true"
            aria-expanded="false"
            onClick={(event) => window.toggleCode?.(event.currentTarget)}
          >
            <span>Show Demo</span>
            <svg className="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="#06e6cb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
      <div className="contract-body" hidden aria-hidden="true">
        <p className="contract-helper">Runs in your browser—no wallet needed.</p>
        <div className="playground-grid">
          <div className="code-column">
            <div className="code-block">
              <pre id="xp-editor(ro)" tabIndex={0} aria-label="Contract code (read only)">
                <code className="language-python" dangerouslySetInnerHTML={{ __html: example.codeHtml }} />
              </pre>
            </div>
          </div>
          <div className="playground-panel">
          <form className="playground-controls" onSubmit={handleCall} aria-busy={isBusy}>
            <label htmlFor="xp-fn">Function</label>
            <input
              id="xp-fn"
              type="text"
              value={functionName}
              onChange={(event) => setFunctionName(event.target.value)}
              placeholder="deposit"
              autoComplete="off"
              disabled={isBusy}
            />
            <label htmlFor="xp-kwargs">Kwargs JSON</label>
            <textarea
              id="xp-kwargs"
              value={kwargsInput}
              onChange={(event) => setKwargsInput(event.target.value)}
              rows={6}
              placeholder='{"amount": 200, "$caller": "alice"}'
              disabled={isBusy}
            />
            <p className="kwargs-hint">
              Use <code>$caller</code>, <code>$signer</code>, or <code>$this</code> to override context values.
            </p>
            <div className="playground-actions">
              <button type="submit" id="xp-btn-call" className="xp-button xp-button--primary" disabled={isBusy}>
                Call
              </button>
              <button type="button" id="xp-btn-reset" className="xp-button" onClick={handleReset} disabled={isBusy}>
                Reset
              </button>
            </div>
            <div className="playground-links">
              <a
                id="xp-btn-open-tutorial"
                className="xp-button xp-button--ghost"
                href={DOC_URL}
                target="_blank"
                rel="noreferrer"
              >
                Open Full Tutorial
              </a>
            </div>
          </form>
          <div id="xp-log" role="log" aria-live="polite">
            {logs.length === 0 ? (
              <p className="log-placeholder">Interact with the contract to see output.</p>
            ) : (
              logs.map((entry) => (
                <div key={entry.id} className={`log-entry log-${entry.type}`}>
                  <div className="log-entry__header">
                    <span className="log-entry__title">{entry.title}</span>
                    <span className="log-entry__time">{formatTime(entry.timestamp)}</span>
                  </div>
                  <p className="log-entry__message">{entry.message}</p>
                  {entry.details ? <pre className="log-entry__details">{entry.details}</pre> : null}
                  {entry.pythonLogs && entry.pythonLogs.length > 0 ? (
                    <details className="log-entry__python">
                      <summary>Runtime log</summary>
                      <ul>
                        {entry.pythonLogs.map((log, index) => (
                          <li key={index}>{log.message}</li>
                        ))}
                      </ul>
                    </details>
                  ) : null}
                </div>
              ))
            )}
          </div>
          <details className="state-viewer" open aria-live="polite">
            <summary>State</summary>
            <pre id="xp-state" role="status" aria-busy={!pyReady || isBusy}>{stateText}</pre>
            {pyReady ? (
              <p className="state-note">
                Driver storage entries mirror the live engine&apos;s key-value store (<code>contract.variable:keys</code>) and are shown here.
              </p>
            ) : null}
            {!pyReady ? <p className="state-hint">Sandbox loads on first interaction.</p> : null}
          </details>
        </div>
      </div>
    </div>
  </div>
  );
}

export default ContractPlayground;
