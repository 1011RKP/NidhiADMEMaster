export class Program {
  Id: string;
  Title: string;
}

export class Compound {
  Id: string;
  Title: string;
  Program: Program;
}

export class Comment {
  Description: string;
  Url: string;
}
export class ADMEData {
  Id: string;
  StudyNumber: string;
  Dose: string;
  ImaxCmax: string;
  Igut: string;
  MW: string;
  LinMax: string;
  PlasmaPB: string;
  MicrosomalPB: string;
  StableDose: boolean;
  FaFg: string;
  Ka: string;
  Qh: string;
  Rb: string;
  Microsomaltested: boolean;
  Comment: string;
  CommentLink: Comment;
}
