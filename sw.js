self.addEventListener("install", (event) => {
    self.skipWaiting();
  });
  
  self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim());
  });
  
  // 이 MVP는 "앱을 열었을 때" 알림을 띄우는 방식이라 push는 아직 없음.
  // 다음 단계에서 Workers로 Push(구독+발송) 붙이면 여기서 push 이벤트 처리하면 됨.
  self.addEventListener("push", (event) => {
    let data = {};
    try { data = event.data ? event.data.json() : {}; } catch (e) {}
    const title = data.title || "Keep or Toss";
    const options = {
      body: data.body || "Reminder",
      icon: data.icon || undefined,
      badge: data.badge || undefined
    };
    event.waitUntil(self.registration.showNotification(title, options));
  });
  
  self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil((async () => {
      const allClients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      if (allClients.length) {
        allClients[0].focus();
        return;
      }
      await self.clients.openWindow("./");
    })());
  });
  