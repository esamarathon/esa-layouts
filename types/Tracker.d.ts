// The object from the tracker API.
interface BidFields {
  state: string;
  parent: number | null;
  description: string; // Can be empty
  shortdescription: string; // Can be empty
  name: string;
  total: string;
  speedrun__name?: string;
  speedrun__category?: string;
  speedrun__endtime?: string;
  istarget: boolean;
  allowuseroptions: boolean;
  goal: string | null;
}
interface BidChildFields extends BidFields {
  parent: number;
}

export namespace Tracker {
  interface EventInfo {
    id: number;
    short: string;
    total: number;
  }

  // The object(s) from the tracker API.
  interface Bid {
    pk: number;
    model: string;
    fields: BidFields;
  }
  interface BidChild {
    pk: number;
    model: string;
    fields: BidChildFields;
  }

  interface FormattedBid {
    id: number;
    name: string;
    description?: string;
    total: number;
    game?: string;
    category?: string;
    endTime?: number;
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
  interface Prize {
    pk: number;
    model: string;
    fields: {
      name: string;
      description: string; // Can be empty
      shortdescription: string; // Can be empty
      provider: string; // Can be empty
      minimumbid: string;
      image: string; // Can be empty
      startrun: number | null;
      endrun: number | null;
      startrun__starttime?: string;
      endrun__endtime?: string;
      starttime: string | null;
      endtime: string | null;
    }
  }

  interface FormattedPrize {
    id: number;
    name: string;
    provided?: string;
    minimumBid: number;
    image?: string;
    startTime?: number;
    endTime?: number;
  }

  // The object from the tracker API.
  interface Donation {
    pk: number;
    model: string;
    fields: {
      donor__public: string;
      amount: string;
      comment: string; // Can be empty
      commentstate: string;
      timereceived: string;
    }
  }

  interface FormattedDonation {
    id: number;
    name: string;
    amount: number;
    comment?: string;
    timestamp: number;
  }
}
