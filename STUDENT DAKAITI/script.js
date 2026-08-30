"use strict";

/* =========================================================
   TUITION FEES MANAGER
   COMPLETE VERSION
========================================================= */


/* =========================================================
   MONTHS
========================================================= */

const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];


/* =========================================================
   DATA
========================================================= */

let students = [];
let payments = [];


/* =========================================================
   LOAD DATA
========================================================= */

function loadData() {

    try {

        const savedStudents =
            localStorage.getItem("tfm_students");

        const savedPayments =
            localStorage.getItem("tfm_payments");


        students =
            savedStudents
                ? JSON.parse(savedStudents)
                : [];


        payments =
            savedPayments
                ? JSON.parse(savedPayments)
                : [];


        if (!Array.isArray(students)) {
            students = [];
        }


        if (!Array.isArray(payments)) {
            payments = [];
        }

    } catch (error) {

        console.error(
            "Data loading error:",
            error
        );

        students = [];
        payments = [];

    }

}


loadData();


/* =========================================================
   SAVE DATA
========================================================= */

function saveData() {

    try {

        localStorage.setItem(
            "tfm_students",
            JSON.stringify(students)
        );


        localStorage.setItem(
            "tfm_payments",
            JSON.stringify(payments)
        );

    } catch (error) {

        console.error(
            "Data saving error:",
            error
        );

        alert(
            "Data save nahi ho pa raha. Browser storage check karein."
        );

    }

}


/* =========================================================
   MONEY
========================================================= */

function money(value) {

    return (
        "₹" +
        Number(value || 0).toLocaleString("en-IN")
    );

}


/* =========================================================
   SAFE HTML
========================================================= */

function safe(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   DATE
========================================================= */

function formatDate(date) {

    if (!date) {
        return "-";
    }


    const parts =
        String(date).split("-");


    if (parts.length === 3) {

        return (
            parts[2] +
            "/" +
            parts[1] +
            "/" +
            parts[0]
        );

    }


    return date;

}


/* =========================================================
   TODAY
========================================================= */

function today() {

    const d = new Date();


    return (
        d.getFullYear() +
        "-" +
        String(d.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(d.getDate()).padStart(2, "0")
    );

}


/* =========================================================
   CURRENT MONTH
========================================================= */

function currentMonth() {

    return new Date().getMonth() + 1;

}


/* =========================================================
   CURRENT YEAR
========================================================= */

function currentYear() {

    return new Date().getFullYear();

}


/* =========================================================
   FIND STUDENT
========================================================= */

function findStudent(id) {

    return students.find(function (student) {

        return (
            Number(student.id) ===
            Number(id)
        );

    });

}


/* =========================================================
   NEXT STUDENT ID
========================================================= */

function getNextStudentId() {

    if (students.length === 0) {
        return 1;
    }


    let maxId = 0;


    students.forEach(function (student) {

        const id =
            Number(student.id) || 0;


        if (id > maxId) {
            maxId = id;
        }

    });


    return maxId + 1;

}


/* =========================================================
   NAVIGATION
========================================================= */

// function showSection(id) {

//     document
//         .querySelectorAll(".section")
//         .forEach(function (section) {

//             section.classList.remove("active");

//         });


//     const section =
//         document.getElementById(id);


//     if (section) {

//         section.classList.add("active");

//     }


//     refreshAll();

// }


// window.showSection =
//     showSection;

/* =========================================================
   NAVIGATION - FIXED & STABLE
========================================================= */

function showSection(id) {

    const sections =
        document.querySelectorAll(".section");

    sections.forEach(function (section) {
        section.classList.remove("active");
    });

    const section =
        document.getElementById(id);

    if (!section) {
        return;
    }

    section.classList.add("active");

    /*
       IMPORTANT:
       Refresh ko turant nahi chalana.
       Browser ko pehle section render karne do.
    */

    setTimeout(function () {

        refreshAll();

        /*
           Add Student section open hone par
           Name input automatically focus hoga.
        */

        if (id === "addStudent") {

            const nameInput =
                document.getElementById("studentName");

            if (nameInput) {

                nameInput.focus();

            }

        }

    }, 0);
}

window.showSection = showSection;


/* =========================================================
   ADD STUDENT
========================================================= */

function setupStudentForm() {

    const form =
        document.getElementById(
            "studentForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();


            const name =
                document
                    .getElementById("studentName")
                    .value
                    .trim();


            const className =
                document
                    .getElementById("studentClass")
                    .value
                    .trim();


            const joiningDate =
                document
                    .getElementById("joiningDate")
                    .value;


            const monthlyFees =
                Number(
                    document
                        .getElementById("monthlyFees")
                        .value
                );


            if (!name) {

                alert(
                    "Please enter student name."
                );

                return;

            }


            if (!className) {

                alert(
                    "Please enter class."
                );

                return;

            }


            if (!joiningDate) {

                alert(
                    "Please select joining date."
                );

                return;

            }


            if (monthlyFees <= 0) {

                alert(
                    "Please enter valid monthly fees."
                );

                return;

            }


            const id =
                getNextStudentId();


            students.push({

                id: id,

                name: name,

                className: className,

                joiningDate: joiningDate,

                monthlyFees: monthlyFees

            });


            saveData();


            form.reset();


            refreshAll();


            alert(
                "Student added successfully!\n\n" +
                "Student ID: " +
                id
            );

        }
    );

}


/* =========================================================
   STUDENT TABLE
========================================================= */

function updateStudentTable() {

    const table =
        document.getElementById("studentTable");

    if (!table) return;

    if (students.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="6">
                    No students found.
                </td>
            </tr>
        `;

        return;
    }

    table.innerHTML = students.map(function(student) {

        return `
            <tr>

                <td>
                    <strong>
                        ${safe(student.id)}
                    </strong>
                </td>

                <td>
                    ${safe(student.name)}
                </td>

                <td>
                    ${safe(student.className)}
                </td>

                <td>
                    ${formatDate(student.joiningDate)}
                </td>

                <td>
                    ${money(student.monthlyFees)}
                </td>

                <td>

                    <button
                        type="button"
                        onclick="editStudent(${Number(student.id)})"
                    >
                        ✏️ Edit
                    </button>

                    <button
                        type="button"
                        onclick="deleteStudent(${Number(student.id)})"
                    >
                        🗑️ Delete
                    </button>

                </td>

            </tr>
        `;

    }).join("");
}


/* =========================================================
   DASHBOARD STUDENTS
========================================================= */

function updateDashboardStudentTable() {

    const table =
        document.getElementById(
            "dashboardStudentTable"
        );


    if (!table) {
        return;
    }


    if (students.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="5">
                    No students found.
                </td>
            </tr>
        `;

        return;

    }


    table.innerHTML =
        students
            .map(function (student) {

                return `
                    <tr>

                        <td>
                            <strong>
                                ${safe(student.id)}
                            </strong>
                        </td>

                        <td>
                            ${safe(student.name)}
                        </td>

                        <td>
                            ${safe(student.className)}
                        </td>

                        <td>
                            ${formatDate(
                                student.joiningDate
                            )}
                        </td>

                        <td>
                            ${money(
                                student.monthlyFees
                            )}
                        </td>

                    </tr>
                `;

            })
            .join("");

}


/* =========================================================
   DROPDOWNS
========================================================= */

function updateStudentDropdowns() {

    const paymentStudent =
        document.getElementById(
            "paymentStudent"
        );


    const detailStudent =
        document.getElementById(
            "detailStudent"
        );


    if (paymentStudent) {

        const oldValue =
            paymentStudent.value;


        paymentStudent.innerHTML = `
            <option value="">
                Select Student
            </option>

            ${students.map(function (student) {

                return `
                    <option value="${student.id}">
                        ${safe(student.name)}
                        (ID: ${student.id})
                    </option>
                `;

            }).join("")}
        `;


        if (
            students.some(function (student) {

                return (
                    String(student.id) ===
                    String(oldValue)
                );

            })
        ) {

            paymentStudent.value =
                oldValue;

        }

    }


    if (detailStudent) {

        const oldValue =
            detailStudent.value;


        detailStudent.innerHTML = `
            <option value="">
                Select Student
            </option>

            ${students.map(function (student) {

                return `
                    <option value="${student.id}">
                        ${safe(student.name)}
                        (ID: ${student.id})
                    </option>
                `;

            }).join("")}
        `;


        if (
            students.some(function (student) {

                return (
                    String(student.id) ===
                    String(oldValue)
                );

            })
        ) {

            detailStudent.value =
                oldValue;

        }

    }

}


/* =========================================================
   ADD PAYMENT
========================================================= */

function setupPaymentForm() {

    const form =
        document.getElementById(
            "paymentForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();


            const studentId =
                Number(
                    document
                        .getElementById(
                            "paymentStudent"
                        )
                        .value
                );


            const month =
                Number(
                    document
                        .getElementById(
                            "paymentMonth"
                        )
                        .value
                );


            const year =
                Number(
                    document
                        .getElementById(
                            "paymentYear"
                        )
                        .value
                );


            const amount =
                Number(
                    document
                        .getElementById(
                            "paymentAmount"
                        )
                        .value
                );


            const paymentDate =
                document
                    .getElementById(
                        "paymentDate"
                    )
                    .value;


            const student =
                findStudent(studentId);


            if (!student) {

                alert(
                    "Please select a student."
                );

                return;

            }


            if (
                month < 1 ||
                month > 12
            ) {

                alert(
                    "Please select a valid month."
                );

                return;

            }


            if (!year) {

                alert(
                    "Please enter year."
                );

                return;

            }


            if (amount <= 0) {

                alert(
                    "Payment amount must be greater than 0."
                );

                return;

            }


            if (!paymentDate) {

                alert(
                    "Please select payment date."
                );

                return;

            }


            /* -----------------------------------------
               CREATE PAYMENT
            ----------------------------------------- */

            const newPayment = {

                id: Date.now(),

                studentId: studentId,

                month: month,

                year: year,

                amount: amount,

                paymentDate: paymentDate,

                status: "RECEIVED"

            };


            /* -----------------------------------------
               SAVE PAYMENT
            ----------------------------------------- */

            payments.push(
                newPayment
            );


            saveData();


            /* -----------------------------------------
               REFRESH
            ----------------------------------------- */

            refreshAll();


            /* -----------------------------------------
               RESET
            ----------------------------------------- */

            form.reset();


            setDefaults();


            /* -----------------------------------------
               SUCCESS
            ----------------------------------------- */

            alert(
                "✅ Payment Received Successfully!\n\n" +

                "Student: " +
                student.name +

                "\nMonth: " +
                MONTHS[month - 1] +

                "\nYear: " +
                year +

                "\nAmount: " +
                money(amount)
            );

        }
    );

}


/* =========================================================
   RECEIVED PAYMENT TABLE
========================================================= */

function updateReceivedPaymentTable() {

    const table =
        document.getElementById(
            "receivedPaymentTable"
        );


    if (!table) {
        return;
    }


    if (payments.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="7">
                    No payments received yet.
                </td>
            </tr>
        `;

        return;

    }


    /* Latest payment first */

    const sortedPayments =
        [...payments].sort(function (a, b) {

            return (
                Number(b.id) -
                Number(a.id)
            );

        });


    table.innerHTML =
        sortedPayments
            .map(function (payment) {

                const student =
                    findStudent(
                        payment.studentId
                    );


                const studentName =
                    student
                        ? student.name
                        : "Student Deleted";


                return `
                    <tr>

                        <td>
                            ${safe(payment.id)}
                        </td>

                        <td>
                            ${safe(
                                payment.studentId
                            )}
                        </td>

                        <td>
                            ${safe(
                                studentName
                            )}
                        </td>

                        <td>
                            ${safe(
                                MONTHS[
                                    Number(payment.month) - 1
                                ] || "-"
                            )}
                        </td>

                        <td>
                            ${safe(
                                payment.year
                            )}
                        </td>

                        <td>
                            <strong>
                                ${money(
                                    payment.amount
                                )}
                            </strong>
                        </td>

                        <td>
                            ${formatDate(
                                payment.paymentDate
                            )}
                        </td>

                    </tr>
                `;

            })
            .join("");

}


/* =========================================================
   DIRECT PAYMENT
========================================================= */

function getDirectPayment(studentId, month, year) {

    const sid = Number(studentId);
    const mon = Number(month);
    const yr = Number(year);

    return payments
        .filter(function(payment) {

            const paymentStudentId =
                Number(
                    payment.studentId ??
                    payment.studentID ??
                    payment.student_id ??
                    0
                );

            const paymentMonth =
                Number(
                    payment.month ?? 0
                );

            const paymentYear =
                Number(
                    payment.year ?? 0
                );

            return (
                paymentStudentId === sid &&
                paymentMonth === mon &&
                paymentYear === yr
            );

        })
        .reduce(function(total, payment) {

            return total +
                Number(payment.amount || 0);

        }, 0);

}

/* =========================================================
   START MONTH
========================================================= */
function getStartMonth(student) {

    if (!student.joiningDate) {
        return {
            month: 1,
            year: currentYear()
        };
    }

    const date = new Date(
        student.joiningDate + "T00:00:00"
    );

    // Joining month se hi fees start hogi
    return {
        month: date.getMonth() + 1,
        year: date.getFullYear()
    };
}


/* =========================================================
   MONTH NUMBER
========================================================= */

function monthNumber(
    month,
    year
) {

    return (
        Number(year) * 12 +
        Number(month)
    );

}


/* =========================================================
   MONTH STATUS
========================================================= */

function getMonthStatus(student, month, year) {

    const start = getStartMonth(student);

    const requested = monthNumber(month, year);
    const starting = monthNumber(start.month, start.year);

    // Fees start hone se pehle
    if (requested < starting) {
        return {
            expected: 0,
            received: 0,
            pending: 0,
            extra: 0,
            status: "NOT STARTED"
        };
    }

    const fee = Number(student.monthlyFees || 0);

    /*
       Is student ki saari payments ko
       date/month ke order me calculate karenge.
    */

    let remainingMoney = 0;

    let current = starting;

    while (current <= requested) {

        const y = Math.floor((current - 1) / 12);

        const m = current - (y * 12);

        const payment = getDirectPayment(
            student.id,
            m,
            y
        );

        const totalMoney =
            remainingMoney + payment;

        let receivedForThisMonth = 0;

        let pendingForThisMonth = 0;

        let extraAfterThisMonth = 0;


        /*
           Agar payment monthly fee se
           zyada/equal hai
        */

        if (totalMoney >= fee) {

            receivedForThisMonth = fee;

            pendingForThisMonth = 0;

            extraAfterThisMonth =
                totalMoney - fee;

        } else {

            receivedForThisMonth =
                totalMoney;

            pendingForThisMonth =
                fee - totalMoney;

            extraAfterThisMonth = 0;

        }


        /*
           Agar ye wahi month hai
           jiska status poocha gaya hai,
           to result return karo.
        */

        if (current === requested) {

            return {

                expected: fee,

                received:
                    receivedForThisMonth,

                pending:
                    pendingForThisMonth,

                extra:
                    extraAfterThisMonth,

                status:
                    pendingForThisMonth === 0
                        ? "PAID"
                        : "PENDING"

            };

        }


        /*
           Next month ke liye sirf
           extra carry hoga.
        */

        remainingMoney =
            extraAfterThisMonth;


        current++;

    }


    return {

        expected: fee,

        received: 0,

        pending: fee,

        extra: 0,

        status: "PENDING"

    };

}


/* =========================================================
   FEES DETAIL
========================================================= */

function showFeesDetail() {

    const select =
        document.getElementById(
            "detailStudent"
        );


    const history =
        document.getElementById(
            "feesHistory"
        );


    if (!select || !history) {
        return;
    }


    const id =
        Number(select.value);


    if (!id) {

        history.innerHTML = `
            <div class="student-result">
                <p>
                    Select a student to view fees details.
                </p>
            </div>
        `;

        return;

    }


    const student =
        findStudent(id);


    if (!student) {

        history.innerHTML = `
            <div class="student-result">
                <strong>
                    Student not found.
                </strong>
            </div>
        `;

        return;

    }


    const start =
        getStartMonth(student);


    const now =
        new Date();


    const endMonth =
        now.getMonth() + 1;


    const endYear =
        now.getFullYear();


    let rows = "";


    let totalExpected = 0;
    let totalReceived = 0;
    let totalPending = 0;
    let totalExtra = 0;


    for (
        let year = start.year;
        year <= endYear;
        year++
    ) {

        const firstMonth =
            year === start.year
                ? start.month
                : 1;


        const lastMonth =
            year === endYear
                ? endMonth
                : 12;


        for (
            let month = firstMonth;
            month <= lastMonth;
            month++
        ) {

            const status =
                getMonthStatus(
                    student,
                    month,
                    year
                );


            totalExpected +=
                Number(
                    status.expected || 0
                );


            totalReceived +=
                Number(
                    status.received || 0
                );


            totalPending +=
                Number(
                    status.pending || 0
                );


            totalExtra +=
                Number(
                    status.extra || 0
                );


            rows += `
                <tr>

                    <td>
                        ${MONTHS[month - 1]}
                    </td>

                    <td>
                        ${year}
                    </td>

                    <td>
                        ${money(
                            status.expected
                        )}
                    </td>

                    <td>
                        ${money(
                            status.received
                        )}
                    </td>

                    <td class="${
                        status.pending > 0
                            ? "pending"
                            : ""
                    }">

                        ${
                            status.pending > 0
                                ? money(status.pending)
                                : "-"
                        }

                    </td>

                    <td class="${
                        status.extra > 0
                            ? "extra"
                            : ""
                    }">

                        ${
                            status.extra > 0
                                ? "+" + money(status.extra)
                                : "-"
                        }

                    </td>

                    <td>

                        ${
                            status.status === "PAID"

                                ? `
                                    <span class="paid">
                                        PAID
                                    </span>
                                  `

                                : `
                                    <span class="pending">
                                        PENDING
                                    </span>
                                  `
                        }

                    </td>

                </tr>
            `;

        }

    }


    if (!rows) {

        rows = `
            <tr>
                <td colspan="7">
                    No fee records found.
                </td>
            </tr>
        `;

    }


    history.innerHTML = `

        <div class="student-result">

            <h3>
                👨‍🎓 ${safe(student.name)}
            </h3>

            <p>
                <strong>Student ID:</strong>
                ${safe(student.id)}
            </p>

            <p>
                <strong>Class:</strong>
                ${safe(student.className)}
            </p>

            <p>
                <strong>Joining Date:</strong>
                ${formatDate(student.joiningDate)}
            </p>

            <p>
                <strong>Monthly Fees:</strong>
                ${money(student.monthlyFees)}
            </p>

        </div>


        <div class="table-container">

            <table>

                <thead>

                    <tr>
                        <th>Month</th>
                        <th>Year</th>
                        <th>Expected</th>
                        <th>Received</th>
                        <th>Pending</th>
                        <th>Extra</th>
                        <th>Status</th>
                    </tr>

                </thead>

                <tbody>
                    ${rows}
                </tbody>

            </table>

        </div>


        <div class="report-box">

            <div class="report-card">
                <h3>Total Expected</h3>
                <p>
                    ${money(totalExpected)}
                </p>
            </div>

            <div class="report-card">
                <h3>Total Received</h3>
                <p>
                    ${money(totalReceived)}
                </p>
            </div>

            <div class="report-card">
                <h3>Total Pending</h3>
                <p>
                    ${money(totalPending)}
                </p>
            </div>

            <div class="report-card">
                <h3>Total Extra</h3>
                <p>
                    ${money(totalExtra)}
                </p>
            </div>

        </div>

    `;

}


window.showFeesDetail =
    showFeesDetail;


/* =========================================================
   SEARCH
========================================================= */

function searchStudent() {

    const inputElement =
        document.getElementById(
            "searchInput"
        );


    const result =
        document.getElementById(
            "searchResult"
        );


    if (!inputElement || !result) {
        return;
    }


    const input =
        inputElement.value
            .trim()
            .toLowerCase();


    if (!input) {

        result.innerHTML = `
            <div class="student-result">
                <strong>
                    Please enter student ID or name.
                </strong>
            </div>
        `;

        return;

    }


    const found =
        students.filter(
            function (student) {

                const id =
                    String(student.id)
                        .toLowerCase();


                const name =
                    String(student.name)
                        .toLowerCase();


                return (
                    id.includes(input) ||
                    name.includes(input)
                );

            }
        );


    if (found.length === 0) {

        result.innerHTML = `
            <div class="student-result">
                <strong>
                    ❌ Student not found!
                </strong>
            </div>
        `;

        return;

    }


    result.innerHTML =
        found
            .map(function (student) {

                return `
                    <div class="student-result">

                        <h3>
                            👨‍🎓
                            ${safe(student.name)}
                        </h3>

                        <p>
                            <strong>
                                Student ID:
                            </strong>
                            ${safe(student.id)}
                        </p>

                        <p>
                            <strong>
                                Class:
                            </strong>
                            ${safe(student.className)}
                        </p>

                        <p>
                            <strong>
                                Joining Date:
                            </strong>
                            ${formatDate(
                                student.joiningDate
                            )}
                        </p>

                        <p>
                            <strong>
                                Monthly Fees:
                            </strong>
                            ${money(
                                student.monthlyFees
                            )}
                        </p>

                        <button
                            type="button"
                            class="delete-btn"
                            onclick="deleteStudent(${Number(student.id)})"
                        >
                            🗑️ Delete Student
                        </button>

                    </div>
                `;

            })
            .join("");

}


window.searchStudent =
    searchStudent;


/* =========================================================
   DASHBOARD
========================================================= */

function updateDashboard() {

    const totalStudents =
        document.getElementById(
            "totalStudents"
        );


    const totalPayments =
        document.getElementById(
            "totalPayments"
        );


    const currentMonthBox =
        document.getElementById(
            "currentMonth"
        );


    const totalPending =
        document.getElementById(
            "totalPending"
        );


    if (totalStudents) {

        totalStudents.textContent =
            students.length;

    }


    const allPayments =
        payments.reduce(
            function (sum, payment) {

                return (
                    sum +
                    Number(payment.amount || 0)
                );

            },
            0
        );


    if (totalPayments) {

        totalPayments.textContent =
            money(allPayments);

    }


    const cm =
        currentMonth();


    const cy =
        currentYear();


    const collection =
        payments
            .filter(function (payment) {

                return (
                    Number(payment.month) === cm &&
                    Number(payment.year) === cy
                );

            })
            .reduce(
                function (sum, payment) {

                    return (
                        sum +
                        Number(
                            payment.amount || 0
                        )
                    );

                },
                0
            );


    if (currentMonthBox) {

        currentMonthBox.textContent =
            money(collection);

    }


    let pending = 0;


    students.forEach(function (student) {

        const status =
            getMonthStatus(
                student,
                cm,
                cy
            );


        pending +=
            Number(
                status.pending || 0
            );

    });


    if (totalPending) {

        totalPending.textContent =
            money(pending);

    }

}


/* =========================================================
   REPORT MONTH
========================================================= */

function setupReportMonth() {

    const month =
        document.getElementById(
            "reportMonth"
        );


    if (month) {

        month.value =
            String(currentMonth());

    }

}


/* =========================================================
   REPORT
========================================================= */

function generateReport() {

    const monthInput =
        document.getElementById(
            "reportMonth"
        );


    const yearInput =
        document.getElementById(
            "reportYear"
        );


    const result =
        document.getElementById(
            "reportResult"
        );


    if (!result) {
        return;
    }


    const month =
        Number(
            monthInput
                ? monthInput.value
                : currentMonth()
        );


    const year =
        Number(
            yearInput
                ? yearInput.value
                : currentYear()
        );


    if (
        month < 1 ||
        month > 12
    ) {

        alert(
            "Please select a month."
        );

        return;

    }


    if (!year) {

        alert(
            "Please enter year."
        );

        return;

    }


    let totalExpected = 0;
    let totalReceived = 0;
    let totalPending = 0;


    let pendingStudents = [];


    students.forEach(function (student) {

        const status =
            getMonthStatus(
                student,
                month,
                year
            );


        if (status.expected > 0) {

            totalExpected +=
                Number(status.expected || 0);


            totalReceived +=
                Number(status.received || 0);


            totalPending +=
                Number(status.pending || 0);


            if (status.pending > 0) {

                pendingStudents.push({

                    student: student,

                    pending:
                        Number(
                            status.pending || 0
                        )

                });

            }

        }

    });


    let pendingRows = "";


    pendingStudents.forEach(function (item) {

        const student =
            item.student;


        const pendingMonths =
            getPendingMonths(
                student,
                month,
                year
            );


        pendingRows += `
            <tr>

                <td>
                    <strong>
                        ${safe(student.id)}
                    </strong>
                </td>

                <td>
                    ${safe(student.name)}
                </td>

                <td>
                    ${safe(student.className)}
                </td>

                <td>
                    ${money(
                        student.monthlyFees
                    )}
                </td>

                <td class="pending">
                    ${money(
                        item.pending
                    )}
                </td>

                <td>
                    ${pendingMonths}
                </td>

            </tr>
        `;

    });


    if (!pendingRows) {

        pendingRows = `
            <tr>
                <td colspan="6">
                    🎉 No pending fees for
                    ${MONTHS[month - 1]}
                    ${year}.
                </td>
            </tr>
        `;

    }


    result.innerHTML = `

        <div class="report-box">

            <div class="report-card">

                <h3>
                    💰 Total
                    ${MONTHS[month - 1]}
                    Fees
                </h3>

                <p>
                    ${money(totalExpected)}
                </p>

            </div>


            <div class="report-card">

                <h3>
                    ✅ Received
                </h3>

                <p>
                    ${money(totalReceived)}
                </p>

            </div>


            <div class="report-card">

                <h3>
                    ⚠️ Balance
                </h3>

                <p>
                    ${money(totalPending)}
                </p>

            </div>

        </div>


        <div class="pending-list">

            <h3>
                📅
                ${MONTHS[month - 1]}
                ${year}
                -
                Students With Balance
            </h3>


            <div class="table-container">

                <table>

                    <thead>

                        <tr>
                            <th>Student ID</th>
                            <th>Student Name</th>
                            <th>Class</th>
                            <th>Monthly Fees</th>
                            <th>Balance</th>
                            <th>Pending Months</th>
                        </tr>

                    </thead>

                    <tbody>
                        ${pendingRows}
                    </tbody>

                </table>

            </div>

        </div>

    `;

}


window.generateReport =
    generateReport;


/* =========================================================
   PENDING MONTHS
========================================================= */

function getPendingMonths(
    student,
    selectedMonth,
    selectedYear
) {

    const start =
        getStartMonth(student);


    let months = [];


    let current =
        monthNumber(
            start.month,
            start.year
        );


    const end =
        monthNumber(
            selectedMonth,
            selectedYear
        );


    while (current <= end) {

        const year =
            Math.floor(
                (current - 1) / 12
            );


        const month =
            current -
            (year * 12);


        const status =
            getMonthStatus(
                student,
                month,
                year
            );


        if (status.pending > 0) {

            months.push(
                MONTHS[month - 1] +
                " " +
                year
            );

        }


        current++;

    }


    if (months.length === 0) {

        return "-";

    }


    return months.join("<br>");

}


window.getPendingMonths =
    getPendingMonths;


/* =========================================================
   DELETE STUDENT
========================================================= */

function deleteStudent(studentId) {

    const student =
        findStudent(studentId);


    if (!student) {

        alert(
            "Student not found."
        );

        return;

    }


    const confirmDelete =
        confirm(
            "⚠️ DELETE STUDENT\n\n" +

            "Student: " +
            student.name +

            "\nStudent ID: " +
            student.id +

            "\n\n" +

            "Student aur uski saari payment history delete ho jayegi.\n\n" +

            "Are you sure?"
        );


    if (!confirmDelete) {
        return;
    }


    students =
        students.filter(function (s) {

            return (
                Number(s.id) !==
                Number(studentId)
            );

        });


    payments =
        payments.filter(function (payment) {

            return (
                Number(payment.studentId) !==
                Number(studentId)
            );

        });


    saveData();


    refreshAll();


    const searchResult =
        document.getElementById(
            "searchResult"
        );


    if (searchResult) {
        searchResult.innerHTML = "";
    }


    const detailStudent =
        document.getElementById(
            "detailStudent"
        );


    const feesHistory =
        document.getElementById(
            "feesHistory"
        );


    if (detailStudent) {
        detailStudent.value = "";
    }


    if (feesHistory) {

        feesHistory.innerHTML = `
            <div class="student-result">
                <p>
                    Select a student to view fees details.
                </p>
            </div>
        `;

    }


    alert(
        "Student deleted successfully!"
    );

}


window.deleteStudent =
    deleteStudent;
   
/* =========================================================
   DEFAULT VALUES
========================================================= */

function setDefaults() {

    const date =
        document.getElementById(
            "paymentDate"
        );


    const year =
        document.getElementById(
            "paymentYear"
        );


    const month =
        document.getElementById(
            "paymentMonth"
        );


    const reportYear =
        document.getElementById(
            "reportYear"
        );


    const reportMonth =
        document.getElementById(
            "reportMonth"
        );


    if (date) {

        date.value =
            today();

    }


    if (year) {

        year.value =
            currentYear();

    }


    if (month) {

        month.value =
            currentMonth();

    }


    if (reportYear) {

        reportYear.value =
            currentYear();

    }


    if (reportMonth) {

        reportMonth.value =
            currentMonth();

    }

}


/* =========================================================
   REFRESH ALL
========================================================= */

// function refreshAll() {

//     updateDashboard();

//     updateStudentTable();

//     updateDashboardStudentTable();

//     updateStudentDropdowns();

//     updateReceivedPaymentTable();

//     // Fees Detail ko bhi automatically refresh karo
//     const detailStudent =
//         document.getElementById("detailStudent");

//     if (detailStudent && detailStudent.value) {
//         showFeesDetail();
//     }
// }

/* =========================================================
   REFRESH ALL - SAFE VERSION
========================================================= */

function refreshAll() {

    /*
       Sirf required data/UI update karo.
       Add Student form ko touch nahi karna.
    */

    updateDashboard();

    updateStudentTable();

    updateDashboardStudentTable();

    updateStudentDropdowns();

    updateReceivedPaymentTable();


    /*
       Fees Detail tabhi update hoga jab
       user ne student select kiya ho.
    */

    const detailStudent =
        document.getElementById("detailStudent");

    if (
        detailStudent &&
        detailStudent.value
    ) {

        showFeesDetail();

    }

}


/* =========================================================
   START
========================================================= */

// document.addEventListener(
//     "DOMContentLoaded",
//     function () {

//         setupStudentForm();

//         setupPaymentForm();

//         setupReportMonth();

//         setDefaults();

//         refreshAll();

//     }
// );

/* =========================================================
   START - STABLE INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupStudentForm();

        setupPaymentForm();

        setupReportMonth();

        setDefaults();

        refreshAll();


        /*
           Make sure Add Student form inputs
           are always usable.
        */

        const studentForm =
            document.getElementById("studentForm");

        if (studentForm) {

            const inputs =
                studentForm.querySelectorAll(
                    "input"
                );

            inputs.forEach(function (input) {

                input.disabled = false;

                input.readOnly = false;

                input.style.pointerEvents = "auto";

            });

        }

    }
);



/* =========================================================
   DEBUG
========================================================= */

window.checkFeesData =
    function () {

        console.log(
            "STUDENTS:",
            students
        );

        console.log(
            "PAYMENTS:",
            payments
        );

    };
    
// /* =========================================================
//    EDIT STUDENT - WORKING VERSION
// ========================================================= */

// function editStudent(studentId) {

//     const student = students.find(function (s) {
//         return Number(s.id) === Number(studentId);
//     });

//     if (!student) {
//         alert("Student not found!");
//         return;
//     }

//     const name = prompt(
//         "Student Name:",
//         student.name
//     );

//     if (name === null) return;

//     const className = prompt(
//         "Class:",
//         student.className
//     );

//     if (className === null) return;

//     const joiningDate = prompt(
//         "Joining Date (YYYY-MM-DD):",
//         student.joiningDate
//     );

//     if (joiningDate === null) return;

//     const monthlyFees = prompt(
//         "Monthly Fees:",
//         student.monthlyFees
//     );

//     if (monthlyFees === null) return;


//     /* VALIDATION */

//     if (!name.trim()) {
//         alert("Student name cannot be empty.");
//         return;
//     }

//     if (!className.trim()) {
//         alert("Class cannot be empty.");
//         return;
//     }

//     if (!/^\d{4}-\d{2}-\d{2}$/.test(joiningDate)) {
//         alert("Joining date must be YYYY-MM-DD.");
//         return;
//     }

//     const fees = Number(monthlyFees);

//     if (!Number.isFinite(fees) || fees <= 0) {
//         alert("Enter valid monthly fees.");
//         return;
//     }


//     /* UPDATE */

//     student.name = name.trim();
//     student.className = className.trim();
//     student.joiningDate = joiningDate;
//     student.monthlyFees = fees;


//     /* SAVE */

//     saveData();


//     /* REFRESH */

//     refreshAll();


//     alert(
//         "✅ Student details updated successfully!"
//     );
// }

// window.editStudent = editStudent;


// /* =========================================================
//    MAKE FUNCTIONS AVAILABLE TO HTML
// ========================================================= */

// window.showSection = showSection;
// window.showFeesDetail = showFeesDetail;
// window.searchStudent = searchStudent;
// window.generateReport = generateReport;
// window.getPendingMonths = getPendingMonths;
// window.deleteStudent = deleteStudent;
// window.editStudent = editStudent;


/* =========================================================
   EDIT STUDENT
   PROMPT() USE NAHI HOTA
========================================================= */

function editStudent(studentId) {

    const student = students.find(function (s) {
        return Number(s.id) === Number(studentId);
    });

    if (!student) {
        alert("Student not found!");
        return;
    }

    // Remove old edit box if exists
    const oldBox = document.getElementById("editStudentBox");

    if (oldBox) {
        oldBox.remove();
    }


    // Create edit box
    const box = document.createElement("div");

    box.id = "editStudentBox";

    box.style.position = "fixed";
    box.style.left = "0";
    box.style.top = "0";
    box.style.width = "100%";
    box.style.height = "100%";
    box.style.background = "rgba(0,0,0,0.6)";
    box.style.display = "flex";
    box.style.alignItems = "center";
    box.style.justifyContent = "center";
    box.style.zIndex = "999999";


    box.innerHTML = `

        <div style="
            background:white;
            width:90%;
            max-width:450px;
            padding:25px;
            border-radius:12px;
            box-shadow:0 10px 30px rgba(0,0,0,0.3);
        ">

            <h2 style="margin-top:0;">
                ✏️ Edit Student
            </h2>

            <p>
                <strong>Student ID:</strong>
                ${student.id}
            </p>


            <label>Student Name</label>

            <input
                id="editName"
                type="text"
                value="${safe(student.name)}"
                style="
                    width:100%;
                    padding:10px;
                    margin:5px 0 15px;
                    box-sizing:border-box;
                "
            >


            <label>Class</label>

            <input
                id="editClass"
                type="text"
                value="${safe(student.className)}"
                style="
                    width:100%;
                    padding:10px;
                    margin:5px 0 15px;
                    box-sizing:border-box;
                "
            >


            <label>Joining Date</label>

            <input
                id="editDate"
                type="date"
                value="${student.joiningDate}"
                style="
                    width:100%;
                    padding:10px;
                    margin:5px 0 15px;
                    box-sizing:border-box;
                "
            >


            <label>Monthly Fees</label>

            <input
                id="editFees"
                type="number"
                min="1"
                value="${Number(student.monthlyFees)}"
                style="
                    width:100%;
                    padding:10px;
                    margin:5px 0 20px;
                    box-sizing:border-box;
                "
            >


            <div style="
                display:flex;
                gap:10px;
                justify-content:flex-end;
            ">

                <button
                    type="button"
                    id="cancelEdit"
                    style="padding:10px 16px; cursor:pointer;"
                >
                    ❌ Cancel
                </button>


                <button
                    type="button"
                    id="saveEdit"
                    style="padding:10px 16px; cursor:pointer;"
                >
                    💾 Save
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(box);


    /* =====================================================
       CANCEL
    ===================================================== */

    document
        .getElementById("cancelEdit")
        .onclick = function () {

            box.remove();

        };


    /* =====================================================
       SAVE
    ===================================================== */

    document
        .getElementById("saveEdit")
        .onclick = function () {

            const name =
                document
                    .getElementById("editName")
                    .value
                    .trim();


            const className =
                document
                    .getElementById("editClass")
                    .value
                    .trim();


            const joiningDate =
                document
                    .getElementById("editDate")
                    .value;


            const fees =
                Number(
                    document
                        .getElementById("editFees")
                        .value
                );


            /* Validation */

            if (!name) {
                alert("Please enter student name.");
                return;
            }


            if (!className) {
                alert("Please enter class.");
                return;
            }


            if (!joiningDate) {
                alert("Please select joining date.");
                return;
            }


            if (!Number.isFinite(fees) || fees <= 0) {
                alert("Please enter valid monthly fees.");
                return;
            }


            /* Update */

            student.name = name;

            student.className = className;

            student.joiningDate = joiningDate;

            student.monthlyFees = fees;


            /* Save */

            saveData();


            /* Refresh */

            refreshAll();


            /* Close */

            box.remove();


            alert("✅ Student details updated successfully!");

        };


    /* =====================================================
       CLICK OUTSIDE = CLOSE
    ===================================================== */

    box.onclick = function (event) {

        if (event.target === box) {
            box.remove();
        }

    };

}


/* =========================================================
   MAKE EDIT AVAILABLE TO HTML
========================================================= */

window.editStudent = editStudent;