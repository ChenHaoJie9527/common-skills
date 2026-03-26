package example

import "sync"

type Job struct {
	ID   string
	Data string
}

type Result struct {
	JobID string
	Err   error
}

func RunWorkerPool(workerCount int, jobs []Job, fn func(Job) error) []Result {
	jobCh := make(chan Job, len(jobs))
	resultCh := make(chan Result, len(jobs))

	var wg sync.WaitGroup
	for i := 0; i < workerCount; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for job := range jobCh {
				resultCh <- Result{
					JobID: job.ID,
					Err:   fn(job),
				}
			}
		}()
	}

	for _, job := range jobs {
		jobCh <- job
	}
	close(jobCh)

	go func() {
		wg.Wait()
		close(resultCh)
	}()

	results := make([]Result, 0, len(jobs))
	for result := range resultCh {
		results = append(results, result)
	}
	return results
}
