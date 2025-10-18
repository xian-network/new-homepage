export async function initReferralTracker() {
  const urlParams = new URLSearchParams(window.location.search);
  const incomingRef = urlParams.get('uid');

  if (incomingRef && !localStorage.getItem('referrer')) {
    const timestamp = Date.now();
    localStorage.setItem('referrer', incomingRef);
    localStorage.setItem('referrer_ts', timestamp.toString());

    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      await fetch('https://ref.xian.org/create-referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referrer: incomingRef, ip: data.ip, timestamp }),
      });
    } catch (error) {
      console.error('Failed to record referral', error);
    }
  }
}
