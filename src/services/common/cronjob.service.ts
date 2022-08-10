import { CronJob, CronJobParameters } from 'cron';

export default class CronjobService {
  private static instance: CronjobService;
  private jobs: CronJob[] = [];

  private constructor() { }

  static getInstance() {
    if (!CronjobService.instance) {
      this.instance = new CronjobService();
    }

    return this.instance;
  }

  async create(options: CronJobParameters): Promise<CronJob> {
    const job = new CronJob(options);

    this.jobs.push(job);

    return job;
  }

  async stop(): Promise<void> {
    for (const instance of this.jobs) {
      instance.stop();
    }
  }
}
