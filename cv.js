document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

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
    const certificates = document.getElementById("certificates");
    const languages = document.getElementById("languages");
    const achievements = document.getElementById("achievements");
    const profilePhoto = document.getElementById("profilePhoto");

    const cvPreview = document.getElementById("cvPreview");

    const previewPhoto = document.getElementById("previewPhoto");
    const previewName = document.getElementById("previewName");
    const previewJob = document.getElementById("previewJob");
    const previewSummary = document.getElementById("previewSummary");
    const previewEducation = document.getElementById("previewEducation");
    const previewExperience = document.getElementById("previewExperience");
    const previewSkills = document.getElementById("previewSkills");
    const previewProjects = document.getElementById("previewProjects");
    const previewCertificates = document.getElementById("previewCertificates");
    const previewLanguages = document.getElementById("previewLanguages");
    const previewAchievements = document.getElementById("previewAchievements");

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
       HELPERS
    ===================================================== */

    function clean(value) {
        return String(value || "").trim();
    }

    function hasValue(value) {
        return clean(value).length > 0;
    }

    function showSection(section, show) {
        if (section) {
            section.style.display = show ? "" : "none";
        }
    }


    /* =====================================================
       PERSONAL INFORMATION
    ===================================================== */

    function updatePersonal() {

        if (previewName) {
            previewName.textContent =
                clean(fullName?.value) || "Your Name";
        }

        if (previewJob) {
            previewJob.textContent =
                clean(jobTitle?.value) || "Your Target Job";
        }

        updateContacts();
    }


    /* =====================================================
       CONTACT INFORMATION
    ===================================================== */

    function updateContacts() {

        const container =
            document.querySelector(".cv-contact");

        if (!container) {
            return;
        }

        container.innerHTML = "";

        const contactValues = [
            clean(email?.value),
            clean(phone?.value),
            clean(location?.value)
        ].filter(Boolean);

        contactValues.forEach(value => {

            const span =
                document.createElement("span");

            span.textContent = value;

            container.appendChild(span);
        });


        const socialValues = [
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


        socialValues.forEach(item => {

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

            container.appendChild(link);
        });


        if (!container.children.length) {

            const span =
                document.createElement("span");

            span.textContent =
                "email@example.com";

            container.appendChild(span);
        }
    }


    /* =====================================================
       SUMMARY
    ===================================================== */

    function updateSummary() {

        const value =
            clean(summary?.value);

        if (previewSummary) {

            previewSummary.textContent =
                value ||
                "Add a professional summary about yourself.";
        }

        showSection(
            previewSummarySection,
            true
        );
    }


    /* =====================================================
       PROFILE PHOTO
    ===================================================== */

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
                    event => {

                        if (previewPhoto) {

                            previewPhoto.src =
                                event.target.result;

                            previewPhoto.style.display =
                                "block";
                        }
                    };

                reader.readAsDataURL(file);
            }
        );
    }


    /* =====================================================
       EDUCATION
    ===================================================== */

    function updateEducation() {

        if (!previewEducation) {
            return;
        }

        previewEducation.innerHTML = "";

        const items =
            document.querySelectorAll(
                ".education-item"
            );

        let count = 0;


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
                !institution &&
                !qualification &&
                !field &&
                !year
            ) {
                return;
            }


            count++;


            const wrapper =
                document.createElement("div");

            wrapper.className =
                "preview-item";


            if (qualification) {

                const title =
                    document.createElement("div");

                title.className =
                    "preview-item-title";

                title.textContent =
                    qualification;

                wrapper.appendChild(title);
            }


            if (institution) {

                const subtitle =
                    document.createElement("div");

                subtitle.className =
                    "preview-item-subtitle";

                subtitle.textContent =
                    institution;

                wrapper.appendChild(subtitle);
            }


            if (field) {

                const description =
                    document.createElement("div");

                description.className =
                    "preview-item-description";

                description.textContent =
                    field;

                wrapper.appendChild(description);
            }


            if (year) {

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


        if (!count) {

            previewEducation.innerHTML =
                `<p class="empty-preview">
                    Add your educational qualifications.
                </p>`;
        }


        showSection(
            previewEducationSection,
            count > 0
        );
    }


    /* =====================================================
       EXPERIENCE
    ===================================================== */

    function updateExperience() {

        if (!previewExperience) {
            return;
        }

        previewExperience.innerHTML = "";

        const items =
            document.querySelectorAll(
                ".experience-item"
            );

        let count = 0;


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
                !title &&
                !company &&
                !duration &&
                !description
            ) {
                return;
            }


            count++;


            const wrapper =
                document.createElement("div");

            wrapper.className =
                "preview-item";


            if (title) {

                const element =
                    document.createElement("div");

                element.className =
                    "preview-item-title";

                element.textContent =
                    title;

                wrapper.appendChild(element);
            }


            if (company) {

                const element =
                    document.createElement("div");

                element.className =
                    "preview-item-subtitle";

                element.textContent =
                    company;

                wrapper.appendChild(element);
            }


            if (duration) {

                const element =
                    document.createElement("div");

                element.className =
                    "preview-item-date";

                element.textContent =
                    duration;

                wrapper.appendChild(element);
            }


            if (description) {

                const element =
                    document.createElement("div");

                element.className =
                    "preview-item-description";

                element.textContent =
                    description;

                wrapper.appendChild(element);
            }


            previewExperience.appendChild(
                wrapper
            );
        });


        if (!count) {

            previewExperience.innerHTML =
                `<p class="empty-preview">
                    Add your work experience.
                </p>`;
        }


        showSection(
            previewExperienceSection,
            count > 0
        );
    }


    /* =====================================================
       SKILLS
    ===================================================== */

    function updateSkills() {

        if (!previewSkills) {
            return;
        }

        previewSkills.innerHTML = "";

        const value =
            clean(skills?.value);

        if (!value) {

            showSection(
                previewSkillsSection,
                false
            );

            return;
        }


        const skillList =
            value
                .split(",")
                .map(item => clean(item))
                .filter(Boolean);


        skillList.forEach(skill => {

            const span =
                document.createElement("span");

            span.textContent =
                skill;

            previewSkills.appendChild(span);
        });


        showSection(
            previewSkillsSection,
            skillList.length > 0
        );
    }


    /* =====================================================
       PROJECTS
    ===================================================== */

    function updateProjects() {

        if (!previewProjects) {
            return;
        }

        previewProjects.innerHTML = "";

        const items =
            document.querySelectorAll(
                ".project-item"
            );

        let count = 0;


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
                !name &&
                !link &&
                !description
            ) {
                return;
            }


            count++;


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


            if (link) {

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


            if (description) {

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


        if (!count) {

            previewProjects.innerHTML =
                `<p class="empty-preview">
                    Add your projects.
                </p>`;
        }


        showSection(
            previewProjectsSection,
            count > 0
        );
    }


    /* =====================================================
       CERTIFICATES / LANGUAGES / ACHIEVEMENTS
    ===================================================== */

    function updateSimpleSections() {

        const certificateValue =
            clean(certificates?.value);

        const languageValue =
            clean(languages?.value);

        const achievementValue =
            clean(achievements?.value);


        if (previewCertificates) {
            previewCertificates.textContent =
                certificateValue ||
                "Your certificates will appear here.";
        }

        if (previewLanguages) {
            previewLanguages.textContent =
                languageValue ||
                "Your languages will appear here.";
        }

        if (previewAchievements) {
            previewAchievements.textContent =
                achievementValue ||
                "Your achievements will appear here.";
        }


        showSection(
            previewCertificatesSection,
            !!certificateValue
        );

        showSection(
            previewLanguagesSection,
            !!languageValue
        );

        showSection(
            previewAchievementsSection,
            !!achievementValue
        );
    }


    /* =====================================================
       UPDATE EVERYTHING
    ===================================================== */

    function updateCV() {

        updatePersonal();

        updateSummary();

        updateEducation();

        updateExperience();

        updateSkills();

        updateProjects();

        updateSimpleSections();
    }


    /* =====================================================
       ADD EDUCATION
    ===================================================== */

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
    ===================================================== */

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
                                placeholder="Company name">
                        </div>

                        <div class="form-group">
                            <label>Duration</label>

                            <input
                                type="text"
                                name="experienceDuration[]"
                                placeholder="2024 - Present">
                        </div>

                        <div class="form-group">
                            <label>Description</label>

                            <textarea
                                name="experienceDescription[]"
                                placeholder="Describe your responsibilities..."></textarea>
                        </div>

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
    ===================================================== */

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
                            <label>Project Name</label>

                            <input
                                type="text"
                                name="projectName[]"
                                placeholder="Project name">
                        </div>

                        <div class="form-group">
                            <label>Project Link</label>

                            <input
                                type="text"
                                name="projectLink[]"
                                placeholder="https://...">
                        </div>

                        <div
                            class="form-group"
                            style="grid-column:1/-1;">

                            <label>Description</label>

                            <textarea
                                name="projectDescription[]"
                                placeholder="Describe your project..."></textarea>

                        </div>

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
    ===================================================== */

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
       NORMAL INPUT LISTENERS
    ===================================================== */

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
    ===================================================== */

    if (cvForm) {

        cvForm.addEventListener(
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
            }
        );
    }


    /* =====================================================
       PDF DOWNLOAD
       CANVAS → A4 PDF
       MULTIPLE PAGES SUPPORTED
    ===================================================== */

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
                    "Generating PDF...";

                downloadPDF.disabled =
                    true;


                if (!cvPreview) {

                    alert(
                        "CV preview was not found."
                    );

                    downloadPDF.textContent =
                        originalText;

                    downloadPDF.disabled =
                        false;

                    return;
                }


                const originalStyle = {

                    width:
                        cvPreview.style.width,

                    height:
                        cvPreview.style.height,

                    minHeight:
                        cvPreview.style.minHeight,

                    margin:
                        cvPreview.style.margin,

                    boxShadow:
                        cvPreview.style.boxShadow,

                    position:
                        cvPreview.style.position,

                    overflow:
                        cvPreview.style.overflow
                };


                try {

                    if (
                        typeof window.html2canvas !==
                        "function"
                    ) {

                        throw new Error(
                            "html2canvas is not loaded."
                        );
                    }


                    if (
                        !window.jspdf ||
                        !window.jspdf.jsPDF
                    ) {

                        throw new Error(
                            "jsPDF is not loaded."
                        );
                    }


                    /* ---------------------------------
                       PREPARE CV FOR PDF
                    --------------------------------- */

                    cvPreview.style.width =
                        "794px";

                    cvPreview.style.height =
                        "auto";

                    cvPreview.style.minHeight =
                        "0";

                    cvPreview.style.margin =
                        "0";

                    cvPreview.style.boxShadow =
                        "none";

                    cvPreview.style.position =
                        "relative";

                    cvPreview.style.overflow =
                        "visible";


                    /* ---------------------------------
                       WAIT FOR RENDER
                    --------------------------------- */

                    await new Promise(resolve => {

                        requestAnimationFrame(() => {

                            requestAnimationFrame(resolve);

                        });

                    });


                    /* ---------------------------------
                       WAIT FOR IMAGES
                    --------------------------------- */

                    const images =
                        Array.from(
                            cvPreview.querySelectorAll("img")
                        );


                    await Promise.all(

                        images.map(img => {

                            if (img.complete) {

                                return Promise.resolve();
                            }

                            return new Promise(resolve => {

                                img.addEventListener(
                                    "load",
                                    resolve,
                                    { once: true }
                                );

                                img.addEventListener(
                                    "error",
                                    resolve,
                                    { once: true }
                                );

                            });

                        })

                    );


                    /* ---------------------------------
                       CREATE CANVAS
                    --------------------------------- */

                    const canvas =
                        await window.html2canvas(
                            cvPreview,
                            {

                                scale: 2,

                                useCORS: true,

                                allowTaint: true,

                                backgroundColor:
                                    "#ffffff",

                                logging: false,

                                imageTimeout:
                                    15000,

                                scrollX: 0,

                                scrollY: 0,

                                width:
                                    cvPreview.scrollWidth,

                                height:
                                    cvPreview.scrollHeight,

                                windowWidth:
                                    794,

                                windowHeight:
                                    Math.max(
                                        cvPreview.scrollHeight,
                                        1123
                                    )
                            }
                        );


                    if (
                        !canvas ||
                        !canvas.width ||
                        !canvas.height
                    ) {

                        throw new Error(
                            "The CV canvas is empty."
                        );
                    }


                    /* ---------------------------------
                       CREATE A4 PDF
                    --------------------------------- */

                    const jsPDF =
                        window.jspdf.jsPDF;


                    const pdf =
                        new jsPDF({
                            orientation: "portrait",
                            unit: "mm",
                            format: "a4",
                            compress: true
                        });


                    const PAGE_WIDTH =
                        210;

                    const PAGE_HEIGHT =
                        297;


                    /* ---------------------------------
                       PAGE HEIGHT IN PIXELS
                    --------------------------------- */

                    const pagePixelHeight =
                        Math.floor(
                            (
                                PAGE_HEIGHT /
                                PAGE_WIDTH
                            ) *
                            canvas.width
                        );


                    const pageCanvas =
                        document.createElement(
                            "canvas"
                        );


                    const ctx =
                        pageCanvas.getContext(
                            "2d"
                        );


                    if (!ctx) {

                        throw new Error(
                            "Could not create canvas context."
                        );
                    }


                    pageCanvas.width =
                        canvas.width;


                    let sourceY =
                        0;

                    let pageNumber =
                        0;


                    /* ---------------------------------
                       CREATE ALL PDF PAGES
                    --------------------------------- */

                    while (
                        sourceY <
                        canvas.height
                    ) {

                        const currentHeight =
                            Math.min(
                                pagePixelHeight,
                                canvas.height -
                                sourceY
                            );


                        pageCanvas.height =
                            currentHeight;


                        ctx.clearRect(
                            0,
                            0,
                            pageCanvas.width,
                            pageCanvas.height
                        );


                        ctx.fillStyle =
                            "#ffffff";

                        ctx.fillRect(
                            0,
                            0,
                            pageCanvas.width,
                            pageCanvas.height
                        );


                        ctx.drawImage(

                            canvas,

                            0,
                            sourceY,

                            canvas.width,
                            currentHeight,

                            0,
                            0,

                            canvas.width,
                            currentHeight

                        );


                        const imageData =
                            pageCanvas.toDataURL(
                                "image/jpeg",
                                0.98
                            );


                        if (
                            pageNumber > 0
                        ) {

                            pdf.addPage();
                        }


                        const pdfHeight =
                            (
                                currentHeight /
                                canvas.width
                            ) *
                            PAGE_WIDTH;


                        pdf.addImage(

                            imageData,

                            "JPEG",

                            0,
                            0,

                            PAGE_WIDTH,
                            pdfHeight

                        );


                        sourceY +=
                            currentHeight;

                        pageNumber++;
                    }


                    /* ---------------------------------
                       SAVE PDF
                    --------------------------------- */

                    const safeName =
                        name
                            .replace(
                                /[^a-z0-9]/gi,
                                "_"
                            )
                            .replace(
                                /_+/g,
                                "_"
                            )
                            .replace(
                                /^_+|_+$/g,
                                ""
                            ) ||
                        "Professional-CV";


                    pdf.save(
                        `${safeName}_CV.pdf`
                    );


                } catch (error) {

                    console.error(
                        "PDF generation error:",
                        error
                    );


                    alert(
                        "PDF generation failed. Check the browser console for details."
                    );


                } finally {

                    /* ---------------------------------
                       RESTORE LIVE PREVIEW
                    --------------------------------- */

                    cvPreview.style.width =
                        originalStyle.width;

                    cvPreview.style.height =
                        originalStyle.height;

                    cvPreview.style.minHeight =
                        originalStyle.minHeight;

                    cvPreview.style.margin =
                        originalStyle.margin;

                    cvPreview.style.boxShadow =
                        originalStyle.boxShadow;

                    cvPreview.style.position =
                        originalStyle.position;

                    cvPreview.style.overflow =
                        originalStyle.overflow;


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
    ===================================================== */

    attachDynamicListeners();

    updateCV();


    console.log(
        "AMD Digital Studio CV Builder loaded successfully."
    );

});
