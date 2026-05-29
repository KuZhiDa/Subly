class User {
  id: string;
  email: string;
}

class Subscription {
  id: string;
  name: string;
  type: string;
}

export class NotificationDto {
  user: User;
  subscription: Subscription[];
}
