/* =========================================================
   AMD DIGITAL STUDIO
   PROFESSIONAL CV BUILDER
   CV.JS — A4 PDF VERSION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       FORM ELEMENTS
    ====================================================== */

    const cvForm = document.getElementById("cvForm");

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

    const certificates =
        document.getElementById("certificates");

    const languages =
        document.getElementById("languages");

    const achievements =
        document.getElementById("achievements");

    const profilePhoto =
        document.getElementById("profilePhoto");


    /* =====================================================
       PREVIEW ELEMENTS
    ====================================================== */

    const cvPreview =
        document.getElementById("cvPreview");

    const previewPhoto =
        document.getElementById("previewPhoto");

    const previewName =
        document.getElementById("previewName");

    const previewJob =
        document.getElementById("previewJob");

    const previewSummary =
        document.getElementById("previewSummary");

    const previewEducation =
        document.getElementById("previewEducation");

    const previewExperience =
        document.getElementById("previewExperience");

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


    /* =====================================================
       PREVIEW SECTIONS
    ====================================================== */

    const previewSummarySection =
        document.getElementById("previewSummarySection");

    const previewEducationSection =
        document.getElementById("previewEducationSection");

    const previewExperienceSection =
        document.getElementById("previewExperienceSection");

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


    /* =====================================================
       BUTTONS / CONTAINERS
    ====================================================== */

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
       HELPERS
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

        section.style.display =
            visible ? "" : "none";
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

        previewName.textContent =
            name || DEFAULT_NAME;

        previewJob.textContent =
            job || DEFAULT_JOB;

        updateContactLinks();
    }


    /* =====================================================
       CONTACT INFORMATION
    ====================================================== */

    function updateContactLinks() {

        const contactContainer =
            document.querySelector(".cv-contact");

        if (!contactContainer) {
            return;
        }

        contactContainer.innerHTML = "";

        const items = [
            {
                value: clean(email?.value),
                type: "email"
            },
            {
                value: clean(phone?.value),
                type: "phone"
            },
            {
                value: clean(location?.value),
                type: "location"
            }
        ];


        items.forEach(item => {

            if (!item.value) {
                return;
            }

            const span =
                document.createElement("span");

            span.textContent =
                item.value;

            contactContainer.appendChild(span);

        });


        const socials = [

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


        socials.forEach(item => {

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
       SUMMARY
    ====================================================== */

    function updateSummary() {

        const value =
            clean(summary?.value);

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
    }


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


            if (hasValue(qualification)) {

                const title =
                    document.createElement("div");

                title.className =
                    "preview-item-title";

                title.textContent =
                    qualification;

                wrapper.appendChild(title);
            }


            if (hasValue(institution)) {

                const subtitle =
                    document.createElement("div");

                subtitle.className =
                    "preview-item-subtitle";

                subtitle.textContent =
                    institution;

                wrapper.appendChild(subtitle);
            }


            if (hasValue(field)) {

                const fieldElement =
                    document.createElement("div");

                fieldElement.className =
                    "preview-item-description";

                fieldElement.textContent =
                    field;

                wrapper.appendChild(fieldElement);
            }


            if (hasValue(year)) {

                const date =
                    document.createElement("div");

                date.className =
                    "preview-item-date";

                date.textContent =
                    year;

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


            if (hasValue(title)) {

                const titleElement =
                    document.createElement("div");

                titleElement.className =
                    "preview-item-title";

                titleElement.textContent =
                    title;

                wrapper.appendChild(
                    titleElement
                );
            }


            if (hasValue(company)) {

                const companyElement =
                    document.createElement("div");

                companyElement.className =
                    "preview-item-subtitle";

                companyElement.textContent =
                    company;

                wrapper.appendChild(
                    companyElement
                );
            }


            if (hasValue(duration)) {

                const dateElement =
                    document.createElement("div");

                dateElement.className =
                    "preview-item-date";

                dateElement.textContent =
                    duration;

                wrapper.appendChild(
                    dateElement
                );
            }


            if (hasValue(description)) {

                const descriptionElement =
                    document.createElement("div");

                descriptionElement.className =
                    "preview-item-description";

                descriptionElement.textContent =
                    description;

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
            clean(skills?.value);

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
                name || "Project";

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

                wrapper.appendChild(desc);
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
            clean(certificates?.value);

        const languageValue =
            clean(languages?.value);

        const achievementValue =
            clean(achievements?.value);


        previewCertificates.textContent =
            certificateValue ||
            "Your certificates will appear here.";

        previewLanguages.textContent =
            languageValue ||
            "Your languages will appear here.";

        previewAchievements.textContent =
            achievementValue ||
            "Your achievements will appear here.";


        setSectionVisibility(
            previewCertificatesSection,
            hasValue(certificateValue)
        );

        setSectionVisibility(
            previewLanguagesSection,
            hasValue(languageValue)
        );

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

    if (addEducation) {

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

                updateCV();
            }
        );
    }


    /* =====================================================
       ADD EXPERIENCE
    ====================================================== */

    if (addExperience) {

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
                                placeholder="Company name">

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


                        <div class="form-group">

                            <label>
                                Description
                            </label>

                            <textarea
                                name="experienceDescription[]"
                                placeholder="Describe your responsibilities...">
                            </textarea>

                        </div>

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

                updateCV();
            }
        );
    }


    /* =====================================================
       ADD PROJECT
    ====================================================== */

    if (addProject) {

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
                                placeholder="Project name">

                        </div>


                        <div class="form-group">

                            <label>
                                Project Link
                            </label>

                            <input
                                type="text"
                                name="projectLink[]"
                                placeholder="https://...">

                        </div>


                        <div
                            class="form-group"
                            style="grid-column:1/-1;">

                            <label>
                                Description
                            </label>

                            <textarea
                                name="projectDescription[]"
                                placeholder="Describe your project...">
                            </textarea>

                        </div>

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

                updateCV();
            }
        );
    }


    /* =====================================================
       DYNAMIC LISTENERS
    ====================================================== */

    function attachDynamicListeners() {

        const fields =
            document.querySelectorAll(
                ".dynamic-item input, .dynamic-item textarea"
            );


        fields.forEach(field => {

            if (
                field.dataset.cvListener === "true"
            ) {
                return;
            }


            field.dataset.cvListener =
                "true";


            field.addEventListener(
                "input",
                updateCV
            );
        });


        const removeButtons =
            document.querySelectorAll(
                ".remove-item"
            );


        removeButtons.forEach(button => {

            if (
                button.dataset.cvListener === "true"
            ) {
                return;
            }


            button.dataset.cvListener =
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
       NORMAL INPUT LISTENERS
    ====================================================== */

    const normalFields =
        document.querySelectorAll(
            "#cvForm input:not([type='file']), #cvForm textarea"
        );


    normalFields.forEach(field => {

        field.addEventListener(
            "input",
            updateCV
        );
    });


    /* =====================================================
       FORM SUBMIT
    ====================================================== */

    if (cvForm) {

        cvForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                updateCV();

                cvPreview.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        );
    }


    /* =====================================================
       PDF DOWNLOAD — A4
    ====================================================== */

    if (downloadPDF) {

        downloadPDF.addEventListener(
            "click",
            async () => {

                updateCV();


                const name =
                    clean(fullName?.value) ||
                    "Professional-CV";


                const originalText =
                    downloadPDF.textContent;


                downloadPDF.textContent =
                    "⏳ Generating PDF...";


                downloadPDF.disabled =
                    true;


                const originalWidth =
                    cvPreview.style.width;

                const originalMinHeight =
                    cvPreview.style.minHeight;

                const originalHeight =
                    cvPreview.style.height;

                const originalBoxShadow =
                    cvPreview.style.boxShadow;

                const originalMargin =
                    cvPreview.style.margin;


                try {

                    /* ---------------------------------
                       A4 WORK AREA
                    --------------------------------- */

                    cvPreview.style.width =
                        "794px";

                    cvPreview.style.minHeight =
                        "1123px";

                    cvPreview.style.height =
                        "auto";

                    cvPreview.style.margin =
                        "0";

                    cvPreview.style.boxShadow =
                        "none";


                    /* ---------------------------------
                       WAIT FOR RENDER
                    --------------------------------- */

                    await new Promise(
                        resolve =>
                            setTimeout(
                                resolve,
                                500
                            )
                    );


                    /* ---------------------------------
                       PDF OPTIONS
                    --------------------------------- */

                    const options = {

                        margin: 0,

                        filename:
                            `${name.replace(
                                /[^a-z0-9]/gi,
                                "_"
                            )}_CV.pdf`,

                        image: {

                            type: "jpeg",

                            quality: 1
                        },


                        html2canvas: {

                            scale: 2,

                            useCORS: true,

                            allowTaint: true,

                            backgroundColor:
                                "#ffffff",

                            logging: false,

                            scrollX: 0,

                            scrollY: 0,

                            windowWidth: 794,

                            windowHeight:
                                cvPreview.scrollHeight
                        },


                        jsPDF: {

                            unit: "mm",

                            format: "a4",

                            orientation:
                                "portrait",

                            compress: true
                        },


                        pagebreak: {

                            mode: []
                        }

                    };


                    /* ---------------------------------
                       GENERATE PDF
                    --------------------------------- */

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
                        "PDF generation failed. Please try again."
                    );

                } finally {

                    /* -----------------------------
                       RESTORE LIVE PREVIEW
                    ----------------------------- */

                    cvPreview.style.width =
                        originalWidth;

                    cvPreview.style.minHeight =
                        originalMinHeight;

                    cvPreview.style.height =
                        originalHeight;

                    cvPreview.style.boxShadow =
                        originalBoxShadow;

                    cvPreview.style.margin =
                        originalMargin;


                    downloadPDF.textContent =
                        originalText;

                    downloadPDF.disabled =
                        false;
                }

            }
        );
    }


    /* =====================================================
       INITIALIZE
    ====================================================== */

    attachDynamicListeners();

    updateCV();


    console.log(
        "AMD Digital Studio CV Builder loaded successfully."
    );

});
