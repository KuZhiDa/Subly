enum Message {
  BeforeDeadlineOneDay = 'Завтра спишут деньги за подписку ',
  BeforeDeadlineThreeDay = 'Через три дня спишут деньги за подписку ',
  ExpiredSubscriptions = 'Истек срок действия подписки ',
}

export function getMessageForNotification(type: string, name: string) {
  return Message[type] + name + ' .';
}
