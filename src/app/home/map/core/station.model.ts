import { Polluant } from "./polluant.model";

export class Station {
   public id: number;
   public nom: string;
   public latitude: number;
   public longitude: number;
   public nomCommune: String;
   public communeId : number;
   public polluant: Polluant[];

   constructor(params: any) {
      Object.assign(this, params);
    }

    
}