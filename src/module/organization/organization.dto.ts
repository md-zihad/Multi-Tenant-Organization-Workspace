export interface CreateOrganizationDto {
  name: string;
  slug?: string;
  description?: string | null;
}

export interface UpdateOrganizationDto {
  name?: string;
  slug?: string;
  description?: string | null;
  isActive?: boolean;
}

export interface OrganizationResponseDto {
  status: number;
  message: string;
  data: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    isActive: boolean;
  };
}

export interface OrganizationListResponseDto {
  status: number;
  message: string;
  data: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    isActive: boolean;
  }[];
}
