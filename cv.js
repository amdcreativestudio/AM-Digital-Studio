/* =========================================================
   AMD DIGITAL STUDIO
   PROFESSIONAL CV BUILDER
   CV.JS
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

    const previewExperience =
        document.getElementById("previewExperience");

    const previewEducation =
        document.getElementById("previewEducation");

    const previewSkills =
        document.getElementById("previewSkills");

    const previewProjects =
        document.getElementById("previewProjects");

    const previewCertificates =
        document.getElementById("previewCertificates");

    const previewLanguages =
        document.getElementById("previewLanguages");

    const previewAchievements =
        document.getElementById("previewAchievements");

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
       HELPER FUNCTIONS
    ====================================================== */

    function escapeHTML(value) {

        if (value === null || value === undefined) {
            return "";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function clean(value) {

        return String(value || "").trim();

    }


    function hasValue(value) {

        return clean(value).length > 0;

    }


    function getInputs(selector) {

        return Array.from(
            document.querySelectorAll(selector)
        );

    }


    function setSectionVisibility(section, visible) {

        if (!section) {
            return;
        }

        section.style.display = visible
            ? ""
            : "none";
    }


    /* =====================================================
       PERSONAL INFORMATION
    ====================================================== */

    function updatePersonalInfo() {

        const name =
            clean(fullName.value);

        const job =
            clean(jobTitle.value);

        const mail =
            clean(email.value);

        const mobile =
            clean(phone.value);

        const place =
            clean(location.value);


        previewName.textContent =
            name || DEFAULT_NAME;

        previewJob.textContent =
            job || DEFAULT_JOB;

        previewEmail.textContent =
            mail || DEFAULT_EMAIL;

        previewPhone.textContent =
            mobile || DEFAULT_PHONE;

        previewLocation.textContent =
            place || DEFAULT_LOCATION;


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
            {
                value: clean(email.value),
                type: "email"
            },
            {
                value: clean(phone.value),
                type: "phone"
            },
            {
                value: clean(location.value),
                type: "location"
            }
        ];


        contactItems.forEach(item => {

            if (!item.value) {
                return;
            }


            const span =
                document.createElement("span");

            span.textContent =
                item.value;

            contactContainer.appendChild(span);

        });


        const socialLinks = [
            {
                value: clean(linkedin.value),
                label: "LinkedIn"
            },
            {
                value: clean(github.value),
                label: "GitHub"
            },
            {
                value: clean(portfolio.value),
                label: "Portfolio"
            }
        ];


        socialLinks.forEach(item => {

            if (!item.value) {
                return;
            }


            const link =
                document.createElement("a");

            link.href =
                item.value;

            link.target =
                "_blank";

            link.rel =
                "noopener noreferrer";

            link.textContent =
                item.label;

            link.style.color =
                "#246bfe";

            link.style.fontSize =
                "0.68rem";

            link.style.fontWeight =
                "700";

            link.style.textDecoration =
                "none";

            contactContainer.appendChild(link);

        });


        if (!contactContainer.children.length) {

            const span =
                document.createElement("span");

            span.textContent =
                DEFAULT_EMAIL;

            contactContainer.appendChild(span);

        }

    }


    /* =====================================================
       PROFESSIONAL SUMMARY
    ====================================================== */

    function updateSummary() {

        const value =
            clean(summary.value);


        if (value) {

            previewSummary.textContent =
                value;

            setSectionVisibility(
                previewSummarySection,
                true
            );

        } else {

            previewSummary.textContent =
                "Add a professional summary about yourself.";

            setSectionVisibility(
                previewSummarySection,
                true
            );

        }

    }


    /* =====================================================
       PROFILE PHOTO
    ====================================================== */

    profilePhoto.addEventListener(
        "change",
        function () {

            const file =
                this.files[0];

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


            reader.onload =
                function (event) {

                    previewPhoto.src =
                        event.target.result;

                    previewPhoto.style.display =
                        "block";

                };


            reader.readAsDataURL(file);

        }
    );


    /* =====================================================
       EDUCATION
    ====================================================== */

    function updateEducation() {

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
                document.createElement("div");

            wrapper.className =
                "preview-item";


            const title =
                document.createElement("div");

            title.className =
                "preview-item-title";

            title.textContent =
                qualification ||
                "Qualification";


            const subtitle =
                document.createElement("div");

            subtitle.className =
                "preview-item-subtitle";

            subtitle.textContent =
                institution ||
                "Institution";


            const fieldText =
                document.createElement("div");

            fieldText.className =
                "preview-item-description";

            fieldText.textContent =
                field;


            const date =
                document.createElement("div");

            date.className =
                "preview-item-date";

            date.textContent =
                year;


            wrapper.appendChild(title);

            if (hasValue(institution)) {
                wrapper.appendChild(subtitle);
            }

            if (hasValue(field)) {
                wrapper.appendChild(fieldText);
            }

            if (hasValue(year)) {
                wrapper.appendChild(date);
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
                document.createElement("div");

            wrapper.className =
                "preview-item";


            const titleElement =
                document.createElement("div");

            titleElement.className =
                "preview-item-title";

            titleElement.textContent =
                title ||
                "Job Position";


            const companyElement =
                document.createElement("div");

            companyElement.className =
                "preview-item-subtitle";

            companyElement.textContent =
                company;


            const dateElement =
                document.createElement("div");

            dateElement.className =
                "preview-item-date";

            dateElement.textContent =
                duration;


            const descriptionElement =
                document.createElement("div");

            descriptionElement.className =
                "preview-item-description";

            descriptionElement.textContent =
                description;


            wrapper.appendChild(
                titleElement
            );


            if (hasValue(company)) {

                wrapper.appendChild(
                    companyElement
                );

            }


            if (hasValue(duration)) {

                wrapper.appendChild(
                    dateElement
                );

            }


            if (hasValue(description)) {

                wrapper.appendChild(
                    descriptionElement
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

        const value =
            clean(skills.value);


        previewSkills.innerHTML = "";


        if (!value) {

            previewSkills.innerHTML =
                `<span>
                    Add your skills
                </span>`;

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

            span.textContent =
                skill;

            previewSkills.appendChild(
                span
            );

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
                document.createElement("div");

            wrapper.className =
                "preview-item";


            const title =
                document.createElement("div");

            title.className =
                "preview-item-title";

            title.textContent =
                name ||
                "Project";


            wrapper.appendChild(title);


            if (hasValue(link)) {

                const projectLink =
                    document.createElement("a");

                projectLink.href =
                    link;

                projectLink.target =
                    "_blank";

                projectLink.rel =
                    "noopener noreferrer";

                projectLink.textContent =
                    link;

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

                const desc =
                    document.createElement("div");

                desc.className =
                    "preview-item-description";

                desc.textContent =
                    description;

                wrapper.appendChild(
                    desc
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
       SIMPLE SECTIONS
    ====================================================== */

    function updateSimpleSections() {

        const certificateValue =
            clean(certificates.value);

        const languageValue =
            clean(languages.value);

        const achievementValue =
            clean(achievements.value);


        if (certificateValue) {

            previewCertificates.textContent =
                certificateValue;

        }

        setSectionVisibility(
            previewCertificatesSection,
            hasValue(certificateValue)
        );


        if (languageValue) {

            previewLanguages.textContent =
                languageValue;

        }

        setSectionVisibility(
            previewLanguagesSection,
            hasValue(languageValue)
        );


        if (achievementValue) {

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

    }


    /* =====================================================
       ADD EDUCATION
    ====================================================== */

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

                        <label>
                            Institution
                        </label>

                        <input
                            type="text"
                            name="educationInstitution[]"
                            placeholder="School / University">

                    </div>


                    <div class="form-group">

                        <label>
                            Qualification
                        </label>

                        <input
                            type="text"
                            name="educationQualification[]"
                            placeholder="e.g. BSc in Computer Science">

                    </div>


                    <div class="form-group">

                        <label>
                            Field / Specialization
                        </label>

                        <input
                            type="text"
                            name="educationField[]"
                            placeholder="e.g. Software Engineering">

                    </div>


                    <div class="form-group">

                        <label>
                            Year
                        </label>

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


            educationContainer.appendChild(
                item
            );


            attachDynamicListeners();

        }
    );


    /* =====================================================
       ADD EXPERIENCE
    ====================================================== */

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

                        <label>
                            Job Title
                        </label>

                        <input
                            type="text"
                            name="experienceTitle[]"
                            placeholder="e.g. Graphic Designer">

                    </div>


                    <div class="form-group">

                        <label>
                            Company
                        </label>

                        <input
                            type="text"
                            name="experienceCompany[]"
                            placeholder="Company Name">

                    </div>


                    <div class="form-group">

                        <label>
                            Duration
                        </label>

                        <input
                            type="text"
                            name="experienceDuration[]"
                            placeholder="2024 - Present">

                    </div>

                </div>


                <div class="form-group">

                    <label>
                        Responsibilities
                    </label>

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


            experienceContainer.appendChild(
                item
            );


            attachDynamicListeners();

        }
    );


    /* =====================================================
       ADD PROJECT
    ====================================================== */

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


            projectsContainer.appendChild(
                item
            );


            attachDynamicListeners();

        }
    );


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
                    input.dataset.listenerAttached
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
                    button.dataset.listenerAttached
                ) {
                    return;
                }


                button.dataset.listenerAttached =
                    "true";


                button.addEventListener(
                    "click",
                    () => {

                        button
                            .closest(".dynamic-item")
                            ?.remove();

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

    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            updateCV();


            cvPreview.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });


            const button =
                document.getElementById(
                    "generateCV"
                );


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


    /* =====================================================
       PDF DOWNLOAD
    ====================================================== */

    downloadPDF.addEventListener(
        "click",
        async () => {

            updateCV();


            const name =
                clean(fullName.value) ||
                "Professional-CV";


            const originalText =
                downloadPDF.textContent;


            downloadPDF.textContent =
                "⏳ Generating PDF...";


            downloadPDF.disabled =
                true;


            cvPreview.classList.add(
                "pdf-mode"
            );


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
                    backgroundColor: "#ffffff"
                },

                jsPDF: {
                    unit: "mm",
                    format: "a4",
                    orientation: "portrait"
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

            }


            cvPreview.classList.remove(
                "pdf-mode"
            );


            downloadPDF.textContent =
                originalText;

            downloadPDF.disabled =
                false;

        }
    );


    /* =====================================================
       JOB-SPECIFIC CV PREPARATION
    ====================================================== */

    function detectJobCategory() {

        const job =
            clean(jobTitle.value)
                .toLowerCase();


        if (!job) {
            return "general";
        }


        if (
            job.includes("developer") ||
            job.includes("software") ||
            job.includes("programmer") ||
            job.includes("web") ||
            job.includes("engineer") ||
            job.includes("it")
        ) {

            return "technology";

        }


        if (
            job.includes("designer") ||
            job.includes("graphic") ||
            job.includes("creative") ||
            job.includes("ui") ||
            job.includes("ux")
        ) {

            return "design";

        }


        if (
            job.includes("account") ||
            job.includes("finance") ||
            job.includes("bank")
        ) {

            return "finance";

        }


        if (
            job.includes("teacher") ||
            job.includes("lecturer") ||
            job.includes("education")
        ) {

            return "education";

        }


        if (
            job.includes("marketing") ||
            job.includes("sales") ||
            job.includes("social media")
        ) {

            return "marketing";

        }


        if (
            job.includes("manager") ||
            job.includes("management") ||
            job.includes("administrator")
        ) {

            return "management";

        }


        return "general";

    }


    function prepareJobSpecificCV() {

        const category =
            detectJobCategory();


        cvPreview.dataset.jobCategory =
            category;


        /*
         * This system does NOT invent
         * qualifications or experience.
         *
         * It only stores the target job
         * category so
