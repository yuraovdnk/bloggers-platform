export class BlogViewModel {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;

  constructor(model: any) {
    this.id = model.id;
    this.name = model.name;
    this.description = model.description;
    this.websiteUrl = model.websiteUrl;
    this.createdAt = model.createdAt;
    this.isMembership = false;
  }
}
