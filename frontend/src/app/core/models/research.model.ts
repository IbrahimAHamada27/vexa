export interface ResearchPublication {
  id: string;
  organizationId?: string;
  doctorId?: string;
  title: string;
  authors: string[];
  journal?: string;
  publicationDate: string;
  abstract: string;
  doi?: string;
  linkUrl?: string;
}
