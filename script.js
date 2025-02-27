function applyJob() {
    alert("Application Submitted!");
}

document.getElementById('post-job-form')?.addEventListener('submit', function(event) {
    event.preventDefault();
    let title = document.getElementById('job-title').value;
    let company = document.getElementById('company').value;
    let location = document.getElementById('location').value;
    let description = document.getElementById('description').value;
    alert(Job Posted: ${title} at ${company});
});

function searchJobs() {
    let input = document.getElementById('search').value.toLowerCase();
    let jobs = document.querySelectorAll('#job-list li');
    jobs.forEach(job => {
        job.style.display = job.textContent.toLowerCase().includes(input) ? '' : 'none';
    });
}