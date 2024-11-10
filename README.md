# M1: Serialization / Deserialization
> Full name: Haining Zhou
> Email:  haining_zhou@brown.edu>
> Username:  hzhou76

## Summary
> Summarize your implementation, including key challenges you encountered

My implementation comprises 2 software components, totaling 123 lines of code. Key challenges included unfamiliarity with JSON.stringify and JSON.parse syntax (resolved by reading documentations carefully), understanding circular object (resolved by reviewing lectures and going to TA & Prof office hours), and measurement of performance (resolved by reading documentations).

## Correctness & Performance Characterization
> Describe how you characterized the correctness and performance of your implementation

*Correcness*: I wrote 5 tests; these tests take 1.76 sec in total to execute. This includes objects with some possible edge cases, such as a native function that is type "globalThis" instead of "console", different data types (like boolean, array with mixed data types), etc.

*Performance*: Evaluating serialization and deserialization on objects of varying sizes using [high-resolution timers](https://nodejs.org/api/perf_hooks.html) results in the following table:

|               | Serialization | Deserialization |
| ------------- | ------------- | --------------- |
| 100 elems     | 0.275 ms      | 0.242 ms        |
| 1000 elems    | 1.155 ms      | 0.509 ms        |
| 10000 elems   | 11.475 ms     | 6.697 ms        |
| 100 funcs     | 0.140 ms      | 0.360 ms        |
| 1000 funcs    | 0.796 ms      | 1.279 ms        |
| 10000 funcs   | 13.716 ms     | 15.898 ms       |
| 1000 cyles    | 1.778 ms      | 1.222 ms        |
| native objects| 0.481 ms      | 0.006 ms        |
| ...           | `<time>`      | `<time>`        |

## Time to Complete
> Roughly, how many hours did this milestone take you to complete?

Hours: 5 hours

## Wild Guess
> This assignment made a few simplifying assumptions — for example, it does not attempt to support the entire language. How many lines of code do you think it would take to support other features? (If at all possible, try to justify your answer — even a rough justification about the order of magnitude and its correlation to missing features is enough.)

FLoC: Like 100 to 200 lines?

