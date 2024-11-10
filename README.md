# M2: Actors and Remote Procedure Calls (RPC)
> Full name: Haining Zhou
> Email:  haining_zhou@brown.edu
> Username:  hzhou76

## Summary
> Summarize your implementation, including key challenges you encountered

My implementation comprises 3 software components, totaling 263 lines of code. Key challenges included being confused about how to get started (resolved by reviewing the milestone document carefully and inspecting the given test cases) and understanding of how RPC works (resolved by reviewing lecture slides and going to office hours).

## Correctness & Performance Characterization
> Describe how you characterized the correctness and performance of your implementation

*Correctness*: I wrote 5 tests; these tests take 5.7 s to execute. 

*Performance*: Evaluating RPC performance using [high-resolution timers](https://nodejs.org/api/perf_hooks.html) by sending 1000 service requests in a tight loop results in an average throughput of 805.65 requests per second and an average latency of 1.24 ms.

## Key Feature
> How would you explain your implementation of `createRPC` to your grandparents (assuming your grandparents are not computer scientists...), i.e., with the minimum jargon possible?

In a distributed system, nodes between each other need to communicate with each other. The way being used in this project is RPC, where one node will call the createRPC function and return a function stub. The stub will be sent to another node. Later, that node will be able to call this function and make requests. (Well, this still involves some jargons, but I didn't find a concise way to explain things like "what is a node in distributed systems" or "what is a function")

## Time to Complete
> Roughly, how many hours did this milestone take you to complete?

Hours: 8 hours
