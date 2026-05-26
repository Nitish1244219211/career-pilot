import scraperRegistry from './index.js';

const TARGET_SCRAPER = 'linkedin'; // 'naukri' | 'linkedin' | 'angellist' (add more if you add more scrapers)

// CLI entry point
const run = async () => {
    // Args: node runScraperCli.js [query] [location]
    const query = process.argv[2] || 'Node.js Developer';
    const location = process.argv[3] || 'India';

    // Resolve the scraper instance from the shared registry
    const scraper = scraperRegistry.getScraper(TARGET_SCRAPER);
    if (!scraper) {
        console.error(`\n❌ No scraper registered under the name "${TARGET_SCRAPER}".`);
        console.error(`   Available scrapers: ${scraperRegistry.listScrapers().join(', ') || 'none'}`);
        process.exit(1);
    }

    console.log(`\n${'='.repeat(52)}`);
    console.log(`🚀  SCRAPER CLI — ${TARGET_SCRAPER.toUpperCase()}`);
    console.log(`${'='.repeat(52)}`);
    console.log(`🎯  Search Query : "${query}"`);
    console.log(`📍  Location     : "${location}"`);
    console.log(`🔌  Scraper      : ${TARGET_SCRAPER}`);
    console.log(`${'='.repeat(52)}\n`);

    try {
        console.log('⏳  Launching headless browser & running scraper...\n');

        const runSummary = await scraperRegistry.scrapeAll(
            { query, location, remoteOnly: false },
            [TARGET_SCRAPER]
        );

        // ── Stats block ──────────────────────────────────────────────────────
        console.log(`\n${'='.repeat(52)}`);
        console.log(`📈  EXECUTION STATISTICS`);
        console.log(`${'='.repeat(52)}`);
        console.log(`⏱️   Duration       : ${runSummary.stats.durationMs}ms`);
        console.log(`💼  Total Jobs Found: ${runSummary.stats.totalFound}`);

        const sourceStats = runSummary.stats.sources[TARGET_SCRAPER];
        if (sourceStats) {
            console.log(`📁  Source "${TARGET_SCRAPER}":`);
            console.log(`    - Success : ${sourceStats.success ? '✅ YES' : '❌ NO'}`);
            console.log(`    - Count   : ${sourceStats.count}`);
            if (sourceStats.error) {
                console.log(`    - Error   : ${sourceStats.error}`);
            }
        }
        console.log(`${'='.repeat(52)}\n`);

        // ── Job listing block ────────────────────────────────────────────────
        if (runSummary.jobs && runSummary.jobs.length > 0) {
            console.log(`✨  EXTRACTED JOBS:`);
            console.log(`${'-'.repeat(52)}`);
            runSummary.jobs.forEach((job, index) => {
                const salaryText = job.salary?.min
                    ? `${job.salary.currency} ${job.salary.min.toLocaleString()}` +
                    (job.salary.max ? ` – ${job.salary.max.toLocaleString()}` : '') +
                    ` / ${job.salary.period}`
                    : 'Not Disclosed';

                console.log(`\n[${index + 1}] 💼  ${job.title.toUpperCase()}`);
                console.log(`    🏢  Company    : ${job.company}`);
                console.log(`    📍  Location   : ${job.location}`);
                console.log(`    🏷️   Type       : ${job.employmentType}`);
                console.log(`    🌐  Remote     : ${job.isRemote ? 'Yes' : 'No'}`);
                console.log(`    💰  Salary     : ${salaryText}`);
                console.log(`    📅  Posted At  : ${job.postedAt ? job.postedAt.toDateString() : 'Unknown'}`);
                console.log(`    🔑  Skills     : ${job.skills.length ? job.skills.join(', ') : '—'}`);
                console.log(`    🔗  Apply Link : ${job.applyLink}`);
            });
            console.log(`\n${'-'.repeat(52)}`);
        } else {
            console.log('📭  No jobs extracted. Possible causes: anti-bot block, auth wall, or zero results for this query.');
        }

    } catch (err) {
        console.error('🚨  Fatal runner error:', err);
    }
};

run().catch(console.error);

