export interface Holiday {
    id: string;
    name: string;
    date: string;
    description?: string;
  }
  
  export interface Leave {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
    type: "leave";
    reason?: string;
  }