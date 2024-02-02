/* eslint-disable max-len */

export namespace Therungg {
  // Base Marathon Event
  interface MarathonEvent {
    type: string, // Event type, e.g. 'general_data_event'
    name: string, // Event name, e.g. 'General Data'
    description: string, // Event description
    time: string, // ISO timestamp when event occured
    username: string,
    game: string,
    category: string,
    data: any // Specified by the child event
  }

  interface GeneralDataEvent extends MarathonEvent {
    type: 'general_data_event',
    name: 'General Data',
    description: 'Contains general data about the current runner.',
    data: GeneralData
  }

  interface GeneralData {
    personalBest: string, // PB in millis
    personalBestAchievedAt: string, // ISO string when PB was achieved
    attemptCount: number, // Amount of attempts runner did
    finishedAttemptCount: number, // Amount of attempts runner finished
    completionPercentage: string, // Completion percentage
    sumOfBests: string, // Sum of bests in millis
    totalPossibleTimesave: string, // SOB - PB
    totalRunTimeInMilliSeconds: number, // Total time runner spent on category in millis
    totalRunTimeAsString: string // Same as above but in words (e.g. 77 hours)
  }

  interface LiveRunEvent extends MarathonEvent {
    data: LiveRunEventData,
    type: 'live_data_event',
    name: 'Live Run Data',
    description: 'Contains data about the currently in progress run from this runner.',
  }

  interface LiveRunEventData {
    personalBest: number,
    sumOfBests: number,
    runStartedAt?: string, // ISO timestamp when run started
    runStartedAtFromNow?: string, // Same as above but like '1 hour ago'
    lastSplitTime: number, // Total runtime in millis at previous split
    deltaToPersonalBest: number, // Difference to PB in millis. + = behind, - = ahead.
    initialPredictedTime: number | null, // End time that was predicted at beginning of run
    currentPredictedTime?: string, // Currently predicted end time
    deltaCurrentToInitialPredictedTime: number, // Delta of above 2 fields. - = better than expected.
    currentBestPossibleTime: number, // Currently best achievable time, if all golds are matched from now on.
    currentSplitName: string, // Name of current split
    currentSplitIndex: number, // Index of first split. -1 = Reset, 0 = First split
    totalSplitCount: number, // Total amount of splits. For example, currentSplitIndex - 1 == totalSplitCount means we're on last split.
    nextSplitName: string | null, // Name of upcoming split
    nextSplitIndex: number
  }

  interface GoldEvent extends MarathonEvent {
    type: 'gold_split_event',
    name: 'Gold Split Event',
    description: 'A gold split was achieved on the previous split',
    data: {
      splitName: string,
      previousGold: number, // Time that was beaten in millis
      newGold: number, // Time that was achieved
      delta: number
      finishedSplitAttemptCount: number // Amount of times split was achieved. Gold is only impressive if this is high.
    }
  }

  // This is reused for all the top/bottom x% stuff.
  // best_run_ever_event triggers when current run is the best the runner has ever had,
  // top_10_single_segment_event triggers when last split was top 10%,
  // worst_10_single_segment_event triggers when last split was bottom 90%,
  // top_10_total_segment_event triggers when the run is within their 10% best runs

  // These all emit the same `data`
  interface TopXSplitEvent extends MarathonEvent {
    data: {
      splitName: string,
      targetTime: number, // time in millis that was beaten to trigger the event. In the case of worst X, the time was not beaten (because the split is bad).
      achievedTime: number, // the time in millis that was achieved
    }
  }

  interface RunStartedEvent extends MarathonEvent {
    type: 'run_started_event',
    name: 'Run Started Event',
    description: 'Triggers when a new run was started',
    data: {
      personalBest: number,
      expectedEndTime: number
    }
  }

  interface FinalSplitEvent extends MarathonEvent {
    type: 'final_split_event',
    name: 'Final Split Event',
    description: 'Current split is the last split of the run',
    data: {
      splitName: string,
      bestSplitTime: number,
      pbSplitTime: number,
      expectedSplitTime: number,
    }
  }

  interface RunEndedEvent extends MarathonEvent {
    type: 'run_ended_event',
    name: 'Run Ended Event',
    description: 'The run ended!',
    data: {
      finalTime: number,
      personalBest: number,
      deltaToPersonalBest: number,
      predictedTime: number,
      deltaToPredictedTime: number,
    }
  }
}
