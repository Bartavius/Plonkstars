export default async function calculateOffset(action: () => Promise<any>) {
    const start = Date.now();
    const res = await action();
    if (!res || !res.data || !res.data.now) {
        return 0;
    }
    const end = Date.now();
    const rtt = (end - start) / 2;
    const estimatedServerTime = new Date(res.data.now).getTime() + rtt;
    return estimatedServerTime - end;
}