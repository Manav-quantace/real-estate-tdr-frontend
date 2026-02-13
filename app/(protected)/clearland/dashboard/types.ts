export type SearchParams = Record<string, string | string[] | undefined>;

export type ClearLandProject = {
    project_id: string;
    title: string;
    city: string;
    zone: string;
    status: string;
};

export type ClearLandItem = {
    project: ClearLandProject;
    parcel_size_sqm?: number | null;
    size_band?: string | null;
};

export type DashboardResponse = {
    params_init: unknown;
    bidding_window: {
        current_round_t: number;
        window_status: string;
    };
    items: ClearLandItem[];
    filter_options: {
        cities: string[];
        zones: string[];
        bands: string[];
        statuses: string[];
    };
    filters: {
        city?: string;
        zone?: string;
        band?: string;
        status?: string;
    };
};
