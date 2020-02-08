export interface EventInfo {
  id: number;
  short: string;
  total: number;
}

// The object from the tracker API.
export interface Bid {
  pk: number;
  model: string;
  fields: {
    state: string;
    parent: number;
    shortdescription: string;
    description: string;
    name: string;
    total: string;
    speedrun__name: string;
    speedrun__category: string;
    speedrun__endtime: string;
    istarget: boolean;
    allowuseroptions: boolean;
    goal: string | null;
  }
}

export interface FormattedBid {
  id: number;
  name: string;
  description?: string;
  total: number;
  game?: string;
  category?: string;
  endTime: number;
  war: boolean;
  allowUserOptions: boolean;
  options: {
    id: number;
    parent: number;
    name: string;
    total: number;
  }[];
  goal?: number;
}

// The object from the tracker API.
export interface Prize {
  pk: number;
  model: string;
  fields: {
    name: string;
    provider: string;
    minimumbid: string;
    image: string;
    startrun: number | null; // May not be a number?
    endrun: number | null; // May not be a number?
    startrun__starttime?: string;
    endrun__endtime?: string;
    starttime: string;
    endtime: string;
  }
}

export interface FormattedPrize {
  id: number;
  name: string;
  provided?: string;
  minimumBid: number;
  image?: string;
  startTimestamp?: string;
  endTimestamp?: string;
}

// The object from the tracker API.
export interface Donation {
  pk: number;
  model: string;
  fields: {
    donor__public: string;
    amount: string;
    comment: string;
    commentstate: string;
    timereceived: string;
  }
}

export interface FormattedDonation {
  id: number;
  name: string;
  amount: number;
  comment?: string;
  timestamp: string;
}
