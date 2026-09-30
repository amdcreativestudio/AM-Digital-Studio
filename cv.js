/* =========================================================
   AMD DIGITAL STUDIO
   PROFESSIONAL CV BUILDER
   CV.JS — COMPLETE VERSION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ====================================================== */

    const form = document.getElementById("cvForm");

    const fullName = document.getElementById("fullName");
    const jobTitle = document.getElementById("jobTitle");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const location = document.getElementById("location");

    const linkedin = document.getElementById("linkedin");
    const github = document.getElementById("github");
    const portfolio = document.getElementById("portfolio");

    const summary = document.getElementById("summary");
    const skills = document.getElementById("skills");
    const certificates = document.getElementById("certificates");
    const languages = document.getElementById("languages");
    const achievements = document.getElementById("achievements");

    const profilePhoto = document.getElementById("profilePhoto");

    const previewName = document.getElementById("previewName");
    const previewJob = document.getElementById("previewJob");
    const previewEmail = document.getElementById("previewEmail");
    const previewPhone = document.getElementById("previewPhone");
    const previewLocation = document.getElementById("previewLocation");

    const previewPhoto = document.getElementById("previewPhoto");

    const previewSummary = document.getElementById("previewSummary");
    const previewExperience = document.getElementById("previewExperience");
    const previewEducation = document.getElementById("previewEducation");
    const previewSkills = document.getElementById("previewSkills");
    const previewProjects = document.getElementById("previewProjects");
    const previewCertificates = document.getElementById("previewCertificates");
    const previewLanguages = document.getElementById("previewLanguages");
    const previewAchievements = document.getElementById("previewAchievements");

    const previewSummarySection =
        document.getElementById("previewSummarySection");

    const previewExperienceSection =
        document.getElementById("previewExperienceSection");

    const previewEducationSection =
        document.getElementById("previewEducationSection");

    const previewSkillsSection =
        document.getElementById("previewSkillsSection");

    const previewProjectsSection =
        document.getElementById("previewProjectsSection");

    const previewCertificatesSection =
        document.getElementById("previewCertificatesSection");

    const previewLanguagesSection =
        document.getElementById("previewLanguagesSection");

    const previewAchievementsSection =
        document.getElementById("previewAchievementsSection");

    const cvPreview =
        document.getElementById("cvPreview");

    const downloadPDF =
        document.getElementById("downloadPDF");

    const addEducation =
        document.getElementById("addEducation");

    const addExperience =
        document.getElementById("addExperience");

    const addProject =
        document.getElementById("addProject");

    const educationContainer =
        document.getElementById("educationContainer");

    const experienceContainer =
        document.getElementById("experienceContainer");

    const projectsContainer =
        document.getElementById("projectsContainer");


    /* =====================================================
       DEFAULT VALUES
    ====================================================== */

    const DEFAULT_NAME = "Your Name";
    const DEFAULT_JOB = "Your Target Job";
    const DEFAULT_EMAIL = "email@example.com";
    const DEFAULT_PHONE = "+94 XX XXX XXXX";
    const DEFAULT_LOCATION = "Your Location";


    /* =====================================================
       SAFETY / HELPERS
    ====================================================== */

    function clean(value) {
        return String(value || "").trim();
    }


    function hasValue(value) {
        return clean(value).length > 0;
    }


    function setSectionVisibility(section, visible) {

        if (!section) {
            return;
        }

        section.style.display = visible ? "" : "none";
    }


    function createElement(tag, className, text = "") {

        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (text) {
            element.textContent = text;
        }

        return element;
    }


    /* =====================================================
       PERSONAL INFORMATION
    ====================================================== */

    function updatePersonalInfo() {

        const name = clean(fullName?.value);
        const job = clean(jobTitle?.value);
        const mail = clean(email?.value);
        const mobile = clean(phone?.value);
        const place = clean(location?.value);

        if (previewName) {
            previewName.textContent =
                name || DEFAULT_NAME;
        }

        if (previewJob) {
            previewJob.textContent =
                job || DEFAULT_JOB;
        }

        if (previewEmail) {
            previewEmail.textContent =
                mail || DEFAULT_EMAIL;
        }

        if (previewPhone) {
            previewPhone.textContent =
                mobile || DEFAULT_PHONE;
        }

        if (previewLocation) {
            previewLocation.textContent =
                place || DEFAULT_LOCATION;
        }

        updateContactLinks();
    }


    /* =====================================================
       CONTACT LINKS
    ====================================================== */

    function updateContactLinks() {

        const contactContainer =
            document.querySelector(".cv-contact");

        if (!contactContainer) {
            return;
        }

        contactContainer.innerHTML = "";


        const contactItems = [
            clean(email?.value),
            clean(phone?.value),
            clean(location?.value)
        ];


        contactItems.forEach(value => {

            if (!value) {
                return;
            }

            const span =
                document.createElement("span");

            span.textContent = value;

            contactContainer.appendChild(span);

        });


        const socialLinks = [
            {
                value: clean(linkedin?.value),
                label: "LinkedIn"
            },
            {
                value: clean(github?.value),
                label: "GitHub"
            },
            {
                value: clean(portfolio?.value),
                label: "Portfolio"
            }
        ];


        socialLinks.forEach(item => {

            if (!item.value) {
                return;
            }

            const link =
                document.createElement("a");

            link.href = item.value;
            link.target = "_blank";
            link.rel = "noopener noreferrer";

            link.textContent = item.label;

            link.style.color = "#246bfe";
            link.style.fontSize = "0.68rem";
            link.style.fontWeight = "700";
            link.style.textDecoration = "none";

            contactContainer.appendChild(link);

        });


        if (!contactContainer.children.length) {

            const span =
                document.createElement("span");

            span.textContent = DEFAULT_EMAIL;

            contactContainer.appendChild(span);
        }
    }


    /* =====================================================
       PROFESSIONAL SUMMARY
    ====================================================== */

    function updateSummary() {

        const value =
            clean(summary?.value);

        if (!previewSummary) {
            return;
        }

        previewSummary.textContent =
            value ||
            "Add a professional summary about yourself.";

        setSectionVisibility(
            previewSummarySection,
            true
        );
    }


    /* =====================================================
       PROFILE PHOTO
    ====================================================== */

    if (profilePhoto) {

        profilePhoto.addEventListener(
            "change",
            function () {

                const file =
                    this.files?.[0];

                if (!file) {
                    return;
                }


                if (!file.type.startsWith("image/")) {

                    alert(
                        "Please select a valid image file."
                    );

                    this.value = "";

                    return;
                }


                const reader =
                    new FileReader();


                reader.onload = function (event) {

                    if (!previewPhoto) {
                        return;
                    }

                    previewPhoto.src =
                        event.target.result;

                    previewPhoto.style.display =
                        "block";
                };


                reader.readAsDataURL(file);

            }
        );
    }


    /* =====================================================
       EDUCATION
    ====================================================== */

    function updateEducation() {

        if (!previewEducation) {
            return;
        }

        const items =
            document.querySelectorAll(
                ".education-item"
            );

        previewEducation.innerHTML = "";

        let validCount = 0;


        items.forEach(item => {

            const institution =
                item.querySelector(
                    '[name="educationInstitution[]"]'
                )?.value || "";

            const qualification =
                item.querySelector(
                    '[name="educationQualification[]"]'
                )?.value || "";

            const field =
                item.querySelector(
                    '[name="educationField[]"]'
                )?.value || "";

            const year =
                item.querySelector(
                    '[name="educationYear[]"]'
                )?.value || "";


            if (
                !hasValue(institution) &&
                !hasValue(qualification) &&
                !hasValue(field) &&
                !hasValue(year)
            ) {
                return;
            }


            validCount++;


            const wrapper =
                createElement(
                    "div",
                    "preview-item"
                );


            const title =
                createElement(
                    "div",
                    "preview-item-title",
                    qualification ||
                    "Qualification"
                );


            wrapper.appendChild(title);


            if (hasValue(institution)) {

                wrapper.appendChild(
                    createElement(
                        "div",
                        "preview-item-subtitle",
                        institution
                    )
                );
            }


            if (hasValue(field)) {

                wrapper.appendChild(
                    createElement(
                        "div",
                        "preview-item-description",
                        field
                    )
                );
            }


            if (hasValue(year)) {

                wrapper.appendChild(
                    createElement(
                        "div",
                        "preview-item-date",
                        year
                    )
                );
            }


            previewEducation.appendChild(
                wrapper
            );

        });


        if (validCount === 0) {

            previewEducation.innerHTML =
                `<p class="empty-preview">
                    Add your educational qualifications.
                </p>`;
        }


        setSectionVisibility(
            previewEducationSection,
            validCount > 0
        );
    }


    /* =====================================================
       EXPERIENCE
    ====================================================== */

    function updateExperience() {

        if (!previewExperience) {
            return;
        }

        const items =
            document.querySelectorAll(
                ".experience-item"
            );

        previewExperience.innerHTML = "";

        let validCount = 0;


        items.forEach(item => {

            const title =
                item.querySelector(
                    '[name="experienceTitle[]"]'
                )?.value || "";

            const company =
                item.querySelector(
                    '[name="experienceCompany[]"]'
                )?.value || "";

            const duration =
                item.querySelector(
                    '[name="experienceDuration[]"]'
                )?.value || "";

            const description =
                item.querySelector(
                    '[name="experienceDescription[]"]'
                )?.value || "";


            if (
                !hasValue(title) &&
                !hasValue(company) &&
                !hasValue(duration) &&
                !hasValue(description)
            ) {
                return;
            }


            validCount++;


            const wrapper =
                createElement(
                    "div",
                    "preview-item"
                );


            wrapper.appendChild(
                createElement(
                    "div",
                    "preview-item-title",
                    title || "Job Position"
                )
            );


            if (hasValue(company)) {

                wrapper.appendChild(
                    createElement(
                        "div",
                        "preview-item-subtitle",
                        company
                    )
                );
            }


            if (hasValue(duration)) {

                wrapper.appendChild(
                    createElement(
                        "div",
                        "preview-item-date",
                        duration
                    )
                );
            }


            if (hasValue(description)) {

                wrapper.appendChild(
                    createElement(
                        "div",
                        "preview-item-description",
                        description
                    )
                );
            }


            previewExperience.appendChild(
                wrapper
            );

        });


        if (validCount === 0) {

            previewExperience.innerHTML =
                `<p class="empty-preview">
                    Add your work experience.
                </p>`;
        }


        setSectionVisibility(
            previewExperienceSection,
            validCount > 0
        );
    }


    /* =====================================================
       SKILLS
    ====================================================== */

    function updateSkills() {

        if (!previewSkills) {
            return;
        }

        const value =
            clean(skills?.value);

        previewSkills.innerHTML = "";


        if (!value) {

            setSectionVisibility(
                previewSkillsSection,
                false
            );

            return;
        }


        const skillArray =
            value
                .split(",")
                .map(skill => clean(skill))
                .filter(Boolean);


        skillArray.forEach(skill => {

            const span =
                document.createElement("span");

            span.textContent = skill;

            previewSkills.appendChild(span);

        });


        setSectionVisibility(
            previewSkillsSection,
            skillArray.length > 0
        );
    }


    /* =====================================================
       PROJECTS
    ====================================================== */

    function updateProjects() {

        if (!previewProjects) {
            return;
        }

        const items =
            document.querySelectorAll(
                ".project-item"
            );

        previewProjects.innerHTML = "";

        let validCount = 0;


        items.forEach(item => {

            const name =
                item.querySelector(
                    '[name="projectName[]"]'
                )?.value || "";

            const link =
                item.querySelector(
                    '[name="projectLink[]"]'
                )?.value || "";

            const description =
                item.querySelector(
                    '[name="projectDescription[]"]'
                )?.value || "";


            if (
                !hasValue(name) &&
                !hasValue(link) &&
                !hasValue(description)
            ) {
                return;
            }


            validCount++;


            const wrapper =
                createElement(
                    "div",
                    "preview-item"
                );


            wrapper.appendChild(
                createElement(
                    "div",
                    "preview-item-title",
                    name || "Project"
                )
            );


            if (hasValue(link)) {

                const projectLink =
                    document.createElement("a");

                projectLink.href = link;
                projectLink.target = "_blank";
                projectLink.rel =
                    "noopener noreferrer";

                projectLink.textContent = link;

                projectLink.style.color =
                    "#246bfe";

                projectLink.style.fontSize =
                    "0.68rem";

                projectLink.style.textDecoration =
                    "none";

                wrapper.appendChild(
                    projectLink
                );
            }


            if (hasValue(description)) {

                wrapper.appendChild(
                    createElement(
                        "div",
                        "preview-item-description",
                        description
                    )
                );
            }


            previewProjects.appendChild(
                wrapper
            );

        });


        if (validCount === 0) {

            previewProjects.innerHTML =
                `<p class="empty-preview">
                    Add your projects.
                </p>`;
        }


        setSectionVisibility(
            previewProjectsSection,
            validCount > 0
        );
    }


    /* =====================================================
       CERTIFICATES / LANGUAGES / ACHIEVEMENTS
    ====================================================== */

    function updateSimpleSections() {

        const certificateValue =
            clean(certificates?.value);

        const languageValue =
            clean(languages?.value);

        const achievementValue =
            clean(achievements?.value);


        if (previewCertificates) {
            previewCertificates.textContent =
                certificateValue;
        }

        setSectionVisibility(
            previewCertificatesSection,
            hasValue(certificateValue)
        );


        if (previewLanguages) {
            previewLanguages.textContent =
                languageValue;
        }

        setSectionVisibility(
            previewLanguagesSection,
            hasValue(languageValue)
        );


        if (previewAchievements) {
            previewAchievements.textContent =
                achievementValue;
        }

        setSectionVisibility(
            previewAchievementsSection,
            hasValue(achievementValue)
        );
    }


    /* =====================================================
       UPDATE EVERYTHING
    ====================================================== */

    function updateCV() {

        updatePersonalInfo();

        updateSummary();

        updateEducation();

        updateExperience();

        updateSkills();

        updateProjects();

        updateSimpleSections();

        prepareJobSpecificCV();
    }


    /* =====================================================
       ADD EDUCATION
    ====================================================== */

    if (addEducation && educationContainer) {

        addEducation.addEventListener(
            "click",
            () => {

                const item =
                    document.createElement("div");

                item.className =
                    "dynamic-item education-item";


                item.innerHTML = `
                    <div class="form-grid">

                        <div class="form-group">
                            <label>Institution</label>

                            <input
                                type="text"
                                name="educationInstitution[]"
                                placeholder="School / University">
                        </div>


                        <div class="form-group">
                            <label>Qualification</label>

                            <input
                                type="text"
                                name="educationQualification[]"
                                placeholder="e.g. BSc in Computer Science">
                        </div>


                        <div class="form-group">
                            <label>Field / Specialization</label>

                            <input
                                type="text"
                                name="educationField[]"
                                placeholder="e.g. Software Engineering">
                        </div>


                        <div class="form-group">
                            <label>Year</label>

                            <input
                                type="text"
                                name="educationYear[]"
                                placeholder="2023 - 2026">
                        </div>

                    </div>


                    <button
                        type="button"
                        class="remove-item">
                        Remove
                    </button>
                `;


                educationContainer.appendChild(item);

                attachDynamicListeners();

                updateCV();
            }
        );
    }


    /* =====================================================
       ADD EXPERIENCE
    ====================================================== */

    if (addExperience && experienceContainer) {

        addExperience.addEventListener(
            "click",
            () => {

                const item =
                    document.createElement("div");

                item.className =
                    "dynamic-item experience-item";


                item.innerHTML = `
                    <div class="form-grid">

                        <div class="form-group">
                            <label>Job Title</label>

                            <input
                                type="text"
                                name="experienceTitle[]"
                                placeholder="e.g. Graphic Designer">
                        </div>


                        <div class="form-group">
                            <label>Company</label>

                            <input
                                type="text"
                                name="experienceCompany[]"
                                placeholder="Company Name">
                        </div>


                        <div class="form-group">
                            <label>Duration</label>

                            <input
                                type="text"
                                name="experienceDuration[]"
                                placeholder="2024 - 2026">
                        </div>

                    </div>


                    <div class="form-group">

                        <label>Description</label>

                        <textarea
                            name="experienceDescription[]"
                            rows="4"
                            placeholder="Describe your responsibilities and achievements..."></textarea>

                    </div>


                    <button
                        type="button"
                        class="remove-item">
                        Remove
                    </button>
                `;


                experienceContainer.appendChild(item);

                attachDynamicListeners();

                updateCV();
            }
        );
    }


    /* =====================================================
       ADD PROJECT
    ====================================================== */

    if (addProject && projectsContainer) {

        addProject.addEventListener(
            "click",
            () => {

                const item =
                    document.createElement("div");

                item.className =
                    "dynamic-item project-item";


                item.innerHTML = `
                    <div class="form-grid">

                        <div class="form-group">

                            <label>
                                Project Name
                            </label>

                            <input
                                type="text"
                                name="projectName[]"
                                placeholder="Project Name">

                        </div>


                        <div class="form-group">

                            <label>
                                Project Link
                            </label>

                            <input
                                type="url"
                                name="projectLink[]"
                                placeholder="https://...">

                        </div>

                    </div>


                    <div class="form-group">

                        <label>
                            Project Description
                        </label>

                        <textarea
                            name="projectDescription[]"
                            rows="3"
                            placeholder="Describe your project..."></textarea>

                    </div>


                    <button
                        type="button"
                        class="remove-item">
                        Remove
                    </button>
                `;


                projectsContainer.appendChild(item);

                attachDynamicListeners();

                updateCV();
            }
        );
    }


    /* =====================================================
       DYNAMIC LISTENERS
    ====================================================== */

    function attachDynamicListeners() {

        document
            .querySelectorAll(
                ".dynamic-item input, .dynamic-item textarea"
            )
            .forEach(input => {

                if (
                    input.dataset.listenerAttached ===
                    "true"
                ) {
                    return;
                }


                input.dataset.listenerAttached =
                    "true";


                input.addEventListener(
                    "input",
                    updateCV
                );

            });


        document
            .querySelectorAll(
                ".remove-item"
            )
            .forEach(button => {

                if (
                    button.dataset.listenerAttached ===
                    "true"
                ) {
                    return;
                }


                button.dataset.listenerAttached =
                    "true";


                button.addEventListener(
                    "click",
                    () => {

                        const item =
                            button.closest(
                                ".dynamic-item"
                            );

                        if (item) {
                            item.remove();
                        }

                        updateCV();
                    }
                );

            });
    }


    /* =====================================================
       INPUT LISTENERS
    ====================================================== */

    document
        .querySelectorAll(
            "#cvForm input:not([type='file']), #cvForm textarea"
        )
        .forEach(input => {

            input.addEventListener(
                "input",
                updateCV
            );

        });


    /* =====================================================
       FORM SUBMIT
    ====================================================== */

    if (form) {

        form.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                updateCV();


                if (cvPreview) {

                    cvPreview.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }


                const button =
                    document.getElementById(
                        "generateCV"
                    );


                if (!button) {
                    return;
                }


                const originalText =
                    button.innerHTML;


                button.innerHTML =
                    "✓ CV Generated";


                setTimeout(() => {

                    button.innerHTML =
                        originalText;

                }, 1800);

            }
        );
    }


    /* =====================================================
       PDF DOWNLOAD
    ====================================================== */

    if (downloadPDF) {

        downloadPDF.addEventListener(
            "click",
            async () => {

                updateCV();


                if (
                    typeof html2pdf !==
                    "function"
                ) {

                    alert(
                        "PDF generator could not be loaded. Please check your internet connection and try again."
                    );

                    return;
                }


                const name =
                    clean(fullName?.value) ||
                    "Professional-CV";


                const originalText =
                    downloadPDF.textContent;


                downloadPDF.textContent =
                    "⏳ Generating PDF...";


                downloadPDF.disabled =
                    true;


                if (cvPreview) {

                    cvPreview.classList.add(
                        "pdf-mode"
                    );
                }


                const options = {

                    margin: 0,

                    filename:
                        `${name.replace(
                            /[^a-z0-9]/gi,
                            "_"
                        )}_CV.pdf`,

                    image: {
                        type: "jpeg",
                        quality: 0.98
                    },

                    html2canvas: {
                        scale: 2,
                        useCORS: true,
                        backgroundColor:
                            "#ffffff"
                    },

                    jsPDF: {
                        unit: "mm",
                        format: "a4",
                        orientation:
                            "portrait"
                    },

                    pagebreak: {
                        mode: [
                            "css",
                            "legacy"
                        ]
                    }
                };


                try {

                    await html2pdf()
                        .set(options)
                        .from(cvPreview)
                        .save();

                } catch (error) {

                    console.error(
                        "PDF generation error:",
                        error
                    );


                    alert(
                        "Sorry, the PDF could not be generated. Please try again."
                    );

                } finally {

                    if (cvPreview) {

                        cvPreview.classList.remove(
                            "pdf-mode"
                        );
                    }


                    downloadPDF.textContent =
                        originalText;


                    downloadPDF.disabled =
                        false;
                }

            }
        );
    }


    /* =====================================================
       JOB CATEGORY DETECTION
    ====================================================== */

    function detectJobCategory() {

        const job =
            clean(jobTitle?.value)
                .toLowerCase();


        if (!job) {
            return "general";
        }


        /* TECHNOLOGY */

        if (
            job.includes("developer") ||
            job.includes("software") ||
            job.includes("programmer") ||
            job.includes("web") ||
            job.includes("engineer") ||
            job.includes("technology") ||
            job.includes("technician") ||
            job.includes("it ") ||
            job === "it"
        ) {

            return "technology";
        }


        /* DESIGN */

        if (
            job.includes("designer") ||
            job.includes("graphic") ||
            job.includes("creative") ||
            job.includes("ui") ||
            job.includes("ux") ||
            job.includes("video editor") ||
            job.includes("editor")
        ) {

            return "design";
        }


        /* FINANCE */

        if (
            job.includes("account") ||
            job.includes("finance") ||
            job.includes("bank") ||
            job.includes("auditor")
        ) {

            return "finance";
        }


        /* EDUCATION */

        if (
            job.includes("teacher") ||
            job.includes("lecturer") ||
            job.includes("education") ||
            job.includes("tutor")
        ) {

            return "education";
        }


        /* MARKETING */

        if (
            job.includes("marketing") ||
            job.includes("sales") ||
            job.includes("social media") ||
            job.includes("seo")
        ) {

            return "marketing";
        }


        /* MANAGEMENT */

        if (
            job.includes("manager") ||
            job.includes("management") ||
            job.includes("administrator") ||
            job.includes("supervisor")
        ) {

            return "management";
        }


        return "general";
    }


    /* =====================================================
       JOB-SPECIFIC CV PREPARATION
    ====================================================== */

    function prepareJobSpecificCV() {

        if (!cvPreview) {
            return;
        }


        const category =
            detectJobCategory();


        cvPreview.dataset.jobCategory =
            category;
    }


    /* =====================================================
       INITIALIZATION
    ====================================================== */

    attachDynamicListeners();

    updateCV();

    console.log(
        "AMD Professional CV Builder loaded successfully."
    );

});
