# M5: Distributed Execution Engine
> Full name: `Haining Zhou`
> Email:  `haining_zhou@brown.edu`
> Username:  `hzhou76`

## Summary
> Summarize your implementation, including key challenges you encountered

My implementation comprises many new software components, totaling > 200 added lines of code over the previous implementation. Key challenges included synchronizing the map, shuffle, and reduce phase.

## Correctness & Performance Characterization
> Describe how you characterized the correctness and performance of your implementation

*Correctness*: I would say the program performs correctly if it can pass the given tests and the additional tests I can think of. Right now it should be 100% correct as far as I can see.

*Performance*: I would say the program performs efficiently if it can run a large amount of data within some time threshold (I'm currently giving a threashold of 1 second). Right now I think the performance is ok.

## Key Feature
> Which extra features did you implement and how?
- Crawler:
In the map phase, each node will fetch some URLs and do some crawling, then I reused some of the code in m0 to get the real content out of the HTML pages. In the reduce phase, the content from different nodes are collected and stored.
- Inverted index:
In the map phase, each node will process a chunk of the document, convert words to lower case, and compute the inverted index. In the reduce phase, the inverted index from different nodes are collected and returned.
- Distributed string matching:
In the map phase, each node will take a chunk of the dataset and perform matching. In the reduce phase, the matching results from different nodes are collected and returned.

## Time to Complete
> Roughly, how many hours did this milestone take you to complete?

Hours: `> 10 hours`

