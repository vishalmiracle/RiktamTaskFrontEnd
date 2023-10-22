export class User {
  _id: string = "";
  firstName: string = "";
  lastName: string = "";
  userId: string = "";
  role:string="user";
  timestamp?: number;
  updatedOn?: any;
  createdOn?: any;
  isOnline?:boolean;
}

export class Global {
  currentUser: User=new User()
  groupName: String ="Riktam";
  validSession?:boolean=false;
  lastGlobalStateUpdate?: Date | undefined;
  
}

