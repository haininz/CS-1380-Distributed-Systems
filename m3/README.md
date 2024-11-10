# M3: Node Groups & Gossip Protocols
> Full name: `Haining Zhou`
> Email:  `haining_zhou@brown.edu`
> Username:  `hzhou76`

## Summary
> Summarize your implementation, including key challenges you encountered

My implementation comprises 10 new software components, totaling around 480 added lines of code over the previous implementation. Key challenges included having a hard time debugging with limited error messages (resolved by adding "stdio: 'inherit'" in status.spawn), .

## Correctness & Performance Characterization
> Describe how you characterized the correctness and performance of your implementation

*Correctness*: I wrote 5 tests; these tests take 3.934 s to execute. 

*Performance*: Launching a 100 nodes takes about 5 seconds, and propagating a message to the entire network via gossip.send at that scale takes about 10 seconds — assuming the following protocol configuration: e.g. the time to start and join network for each node is negligible.

## Key Feature
> What is the point of having a gossip protocol? Why doesn't a node just send the message to _all_ other nodes in its group?
If we simply broadcast to all other nodes, then the network traffic will be very high. Therefore, we use the gossip protocol instead to make the system more scalable while being able to achieve the same outcome (i.e. every replica receives every update eventually).

## Time to Complete
> Roughly, how many hours did this milestone take you to complete?

Hours: more than 10 hours

