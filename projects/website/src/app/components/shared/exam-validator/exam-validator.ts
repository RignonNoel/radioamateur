import { Component, OnInit } from '@angular/core';
import { Questions } from '../../../interfaces/questions';
import { ServiceQuestions } from '../../../services/service-questions';
import { PracticeExam } from '../../../services/practice-exam';

@Component({
  selector: 'app-exam-validator',
  imports: [],
  templateUrl: './exam-validator.html',
  styleUrl: './exam-validator.scss',
})
export class ExamValidator implements OnInit {
  currentQuestion: Questions | null = null;
  userAnswer: string | null = null;

  constructor(
    private serviceQuestions: ServiceQuestions,
    public practiceExam: PracticeExam,
  ) {}

  ngOnInit() {
    this.loadState();
  }

  loadState() {
    // Récupère LocalStorage
    const state = this.practiceExam.getExamState();

    if (state && Object.keys(state.questions).length > 0) {
      console.log('Examen trouvé. On cherche la dernière question ou la suivante.');

      // récupère les id déjà répondus
      const answeredIds = Object.keys(state.questions);
      const lastId = answeredIds[answeredIds.length - 1];

      // À changer pour la question suivante
      this.loadQuestion(lastId);
    } else {
      console.log('Aucun examen en cours. Chargement de la première question par défaut.');
      // Ajouter une méthode pour choisir une question aléatoire?
      this.loadQuestion('B-001-001-001');
    }
  }

  loadQuestion(id: string) {
    this.serviceQuestions.getQuestions().subscribe((all) => {
      this.currentQuestion = all.find((q) => q.question_id === id) || null;

      if (this.currentQuestion) {
        // Vérifie si une réponse existe déjà
        this.userAnswer = this.practiceExam.getSavedAnswerForQuestion(id);
      }
    });
  }

  onSelectAnswer(selectedAnswer: string) {
    if (!this.currentQuestion) return;

    const id = this.currentQuestion.question_id;

    // Valider si c'est bon
    const isCorrect = this.serviceQuestions.isCorrect(this.currentQuestion, selectedAnswer);

    // Sauvegarder dans le LocalStorage
    this.practiceExam.updateAnswer(id, selectedAnswer);

    // Score??
    if (isCorrect) {
      console.log("Bravo ! C'est la bonne réponse.");
    }

    console.log(`État sauvegardé pour ${id} : ${selectedAnswer}`);
  }
  //Clasement des réponses dans les a, b, c, d
  getReponseParLettre(lettre: string): string {
    if (!this.currentQuestion) return '';
    return (this.currentQuestion as any)[`reponse_${lettre}`];
  }
}
