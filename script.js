// ===========================
// GLOBAL VARIABLES
// ===========================

let isDark = true;
let chartInstance = null;

const select = document.getElementById("career-select");
const output = document.getElementById("roadmap-output");

// ===========================
// CAREER SELECTION
// ===========================

select.addEventListener("change", () => {

    const key = select.value;

    if (!key) {
        output.classList.add("hidden");
        return;
    }

    renderRoadmap(careers[key]);

    output.classList.remove("hidden");

});

// ===========================
// RENDER ROADMAP
// ===========================

function renderRoadmap(career) {

    // Suggestion
    document.getElementById("ai-suggestion").textContent =
        career.suggestion;

    // ===========================
    // Timeline
    // ===========================

    const timeline = document.getElementById("timeline-container");

    timeline.innerHTML = "";

    career.timeline.forEach((item, index) => {

        const div = document.createElement("div");

        div.className = "timeline-item";

        div.innerHTML = `
            <h4 class="text-white font-semibold">
                ${item.phase}
            </h4>

            <p class="text-gray-400 text-sm mt-1">
                ${item.desc}
            </p>
        `;

        timeline.appendChild(div);

        setTimeout(() => {

            div.classList.add("show");

        }, index * 150);

    });

    // ===========================
    // Radar Chart
    // ===========================

    if (chartInstance) {

        chartInstance.destroy();

    }

    const ctx =
        document.getElementById("skills-chart").getContext("2d");

    chartInstance = new Chart(ctx, {

        type: "radar",

        data: {

            labels: career.skills.labels,

            datasets: [

                {

                    label: "Skill Level",

                    data: career.skills.data,

                    backgroundColor:
                        "rgba(102,126,234,0.2)",

                    borderColor:
                        "rgba(102,126,234,1)",

                    pointBackgroundColor:
                        "rgba(240,147,251,1)",

                    pointBorderColor: "#ffffff",

                    pointRadius: 4

                }

            ]

        },

        options: {

            responsive: true,

            scales: {

                r: {

                    beginAtZero: true,

                    max: 100,

                    ticks: {

                        color: isDark
                            ? "#aaaaaa"
                            : "#555555"

                    },

                    grid: {

                        color: isDark
                            ? "rgba(255,255,255,.1)"
                            : "rgba(0,0,0,.1)"

                    },

                    pointLabels: {

                        color: isDark
                            ? "#dddddd"
                            : "#333333",

                        font: {

                            size: 12

                        }

                    }

                }

            },

            plugins: {

                legend: {

                    labels: {

                        color: isDark
                            ? "#dddddd"
                            : "#333333"

                    }

                }

            }

        }

    });

    // ===========================
    // Badges
    // ===========================

    const badgeContainer =
        document.getElementById("badges-container");

    badgeContainer.innerHTML =
        career.badges
            .map(
                badge =>
                    `<span class="badge text-white">${badge}</span>`
            )
            .join("");

    // ===========================
    // Resources
    // ===========================

    const resources =
        document.getElementById("resources-container");

    resources.innerHTML =
        career.resources
            .map(
                item =>

                `
        <a href="${item.url}"
           target="_blank"
           class="glass p-4 flex items-center gap-3 hover:scale-[1.02] transition text-white no-underline">

            <span class="text-xs px-2 py-1 rounded bg-purple-500/30 text-purple-300 font-medium">

                ${item.type}

            </span>

            <span class="font-medium">

                ${item.title}

            </span>

            <i data-lucide="external-link"
               class="w-4 h-4 ml-auto opacity-50"></i>

        </a>

        `
            )
            .join("");

    lucide.createIcons();

}

// ===========================
// DARK MODE
// ===========================

document
    .getElementById("dark-toggle")
    .addEventListener("click", () => {

        isDark = !isDark;

        document.body.classList.toggle("light-mode");

        if (select.value) {

            renderRoadmap(
                careers[select.value]
            );

        }

    });

// ===========================
// DOWNLOAD PDF
// ===========================

document
    .getElementById("pdf-btn")
    .addEventListener("click", async () => {

        const element =
            document.getElementById("main-content");

        const canvas =
            await html2canvas(element, {

                backgroundColor: "#0f0c29",

                scale: 1.5

            });

        const { jsPDF } = window.jspdf;

        const pdf =
            new jsPDF("p", "mm", "a4");

        const image =
            canvas.toDataURL("image/png");

        const width =
            pdf.internal.pageSize.getWidth();

        const height =
            (canvas.height * width) /
            canvas.width;

        pdf.addImage(
            image,
            "PNG",
            0,
            0,
            width,
            height
        );

        pdf.save("career-roadmap.pdf");

    });

// ===========================
// LOAD ICONS
// ===========================

lucide.createIcons();