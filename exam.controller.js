const Test = require('../models/test.model');
const Attempt = require('../models/attempt.model');

exports.listTests = (req, res) => {
    const tests = Test.getAllActive();
    res.json({ success: true, tests });
};

exports.startTest = (req, res) => {
    const { testId } = req.params;
    const studentId = req.session.user.id;

    // Check if already attempted
    const existing = Attempt.findByStudentAndTest(studentId, testId);
    if (existing) {
        if (existing.status === 'completed') {
            return res.status(403).json({ error: 'Test already completed' });
        }
        // If in-progress, resume logic could be here
    }

    const attemptId = Attempt.create(studentId, testId);
    const test = Test.findById(testId);

    if (!test) return res.status(404).json({ error: 'Test not found' });

    // Return test data WITHOUT correct answers if needed, or just questions
    // For security, remove 'correct' field from questions if present in DB
    const sanitizedQuestions = test.questions.map(q => ({
        id: q.id,
        text: q.text,
        options: q.options,
        type: q.type
    }));

    res.json({ success: true, attemptId, test: { ...test, questions: sanitizedQuestions } });
};

exports.submitTest = (req, res) => {
    const { attemptId, answers } = req.body; // answers: { qId: answer }
    // Calculate score logic would go here
    // For now, just save

    Attempt.updateStatus(attemptId, 'completed', 0, answers);
    res.json({ success: true });
};

exports.downloadResult = (req, res) => {
    const { attemptId } = req.params;
    // In real app, verify user owns attempt
    const attempt = db.prepare('SELECT * FROM attempts WHERE id = ?').get(attemptId);
    if (!attempt) return res.status(404).send('Attempt not found');

    const test = Test.findById(attempt.test_id);
    const student = Student.findById(attempt.student_id);

    pdfUtil.generateResultPDF(attempt, test, student, res);
};
