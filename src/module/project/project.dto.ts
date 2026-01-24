export interface CreateProjectDto {
    name: string;
    description?: string | null;
  }
  
  export interface UpdateProjectDto {
    name?: string;
    description?: string | null;
    isActive?: boolean;
  }
  
  export interface ProjectResponseDto {
    status: number;
    message: string;
    data: {
      id: string;
      name: string;
      description: string | null;
      organizationId: string;
      createdBy: string;
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
    };
  }
  
  export interface ProjectListResponseDto {
    status: number;
    message: string;
    data: {
      id: string;
      name: string;
      description: string | null;
      organizationId: string;
      createdBy: string;
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
    }[];
  }