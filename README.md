# M0: Setup & Centralized Computing
> Full name: `Haining Zhou`
> Email:  `haining_zhou@brown.edu`
> Username:  `hzhou76`

## Summary
> Summarize your implementation, including key challenges you encountered

My implementation comprises 7 software components, totaling 219 lines of code in the following languages: 44 lines of shell scripts and 175 lines of JavaScript code. Key challenges included unfamaliarity with JavaScript library (overcome by spending time reading documentations), unfamaliarity with shell scripting (overcome by spending time reading documentations), and confusion about what to do for some of the files (review lectures and go to TA hours).

## Correctness & Performance Characterization
> Describe how you characterized the correctness and performance of your implementation

*Correctness*: My implementation passes 9 out of the 9 tests (100%) already provided for M0. I developed another 5 tests, which focus on edge cases that are not tested in the provided tests (e.g. the given test for stemming doesn't cover the case of adjectives). All these tests, combined take no more than 8 seconds in total to complete. There is not much I can say regarding "correctness confidence". I just try to come up with all possible edge cases and make sure they behave as expected.

*Performance*: Evaluating the entire system using the `time` command on the three sandboxes reports the following times:

|           | Engine   | Query    |
| --------- | -------- | -------- |
| Sandbox 1 | 0m33.346s| 0m0.027s |
| Sandbox 2 | 0m54.220s| 0m0.033s |
| Sandbox 3 | >60m     | 0m0.029s |

## Time to Complete
> Roughly, how many hours did this milestone take you to complete?

Hours: `8 hours`

## Wild Guess
> How many lines of code do you think it will take to build the fully distributed, scalable version of your search engine? (If at all possible, try to justify your answer — even a rough justification about the order of magnitude is enough)

DLoC: `5000+ lines of code I guess?`

