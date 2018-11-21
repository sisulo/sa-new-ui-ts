export class MenuItem {
  id: string;
  name: string;


  constructor(label: string, url: string, id: string) {
    this.name = label;
    // this.url = url;
    this.id = id;
  }
}
