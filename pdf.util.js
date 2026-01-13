const PDFDocument = require('pdfkit');

exports.generateResultPDF = (attempt, test, student, res) => {
    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=result-${attempt.id}.pdf`);

    doc.pipe(res);

    // Header
    doc.fontSize(25).text('Xamplore Exam Result', { align: 'center' });
    doc.moveDown();

    // Student Info
    doc.fontSize(14).text(`Student Name: ${student.name}`);
    doc.text(`Student ID: ${student.id}`);
    doc.text(`Test: ${test.title}`);
    doc.text(`Date: ${new Date(attempt.completed_at).toLocaleString()}`);
    doc.moveDown();

    // Score
    doc.fontSize(18).text(`Status: ${attempt.status.toUpperCase()}`, { align: 'center' });
    // doc.text(`Score: ${attempt.score}`, { align: 'center' }); // Score logic not fully implemented yet
    doc.moveDown();

    // Answers Review
    doc.fontSize(16).text('Answer Review', { underline: true });
    doc.moveDown();

    const answers = JSON.parse(attempt.answers || '{}');
    const reviewData = test.questions; // In real app, match IDs

    /* reviewData.forEach((q, i) => {
       doc.fontSize(12).text(`Q${i+1}: ${q.text}`);
       doc.fontSize(10).text(`Selected: ${answers[q.id] || 'Not Answered'}`);
       doc.text(`Correct: ${q.correctAnswer || 'Hidden'}`); // Assuming we have this
       doc.moveDown(0.5);
    }); */

    doc.text('Detailed review not available in demo mode.');

    // Certificate (if passed)
    if (attempt.status === 'completed') {
        doc.addPage();
        doc.rect(20, 20, 550, 750).stroke();
        doc.fontSize(30).text('CERTIFICATE OF COMPLETION', 100, 100, { align: 'center' });
        doc.fontSize(20).text('This certifies that', { align: 'center' });
        doc.fontSize(25).text(student.name, { align: 'center' });
        doc.fontSize(20).text(`has completed the exam: ${test.title}`, { align: 'center' });
    }

    doc.end();
};
