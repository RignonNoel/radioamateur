import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ServiceQuestions } from '../../../services/service-questions';

@Component({
  selector: 'app-exam-generator',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './exam-generator.html',
  styleUrl: './exam-generator.scss',
})
export class ExamGenerator implements OnInit {
  // La liste de tes sections (tu pourras compléter la liste jusqu'à B-015)
  categories = [
    { code: 'B-001', name: 'Règlements et politiques' },
    { code: 'B-002', name: 'Brouillage et interférence' },
    { code: 'B-003', name: 'Exploitation et procédures' },
    { code: 'B-004', name: 'Systèmes radio' },
    // Ajoute les autres ici...
  ];

  selectedCategory = signal<string>(''); // Stocke la section choisie (ex: 'B-001')
  currentQuestionLabel = signal<string>('');
  currentAnswers = signal<string[]>([]);
  selectedAnswer = signal<string>(''); // Stocke le choix de l'utilisateur
  feedback = signal<string>(''); // Message de succès ou d'erreur
  currentId = '';

  // L'injection de ton service se fait ici dans le constructeur
  constructor(private questionService: ServiceQuestions) {}

  ngOnInit() {
    //
  }

  chargerNouvelleQuestion() {
    this.feedback.set('');
    this.selectedAnswer.set('');

    this.questionService.getRandomQuestionId().subscribe((id) => {
      this.currentId = id;
      this.questionService
        .getLabelForQuestion(id)
        .subscribe((label) => this.currentQuestionLabel.set(label));
      this.questionService
        .getRandomizedAnswersForQuestion(id)
        .subscribe((answers) => this.currentAnswers.set(answers));
    });
  }

  // Cette fonction est appelée par le bouton "Démarrer" ou "Suivante"
  onCategoryChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedCategory.set(selectElement.value);
    // On réinitialise l'affichage si on change de catégorie
    this.currentQuestionLabel.set('');
    this.feedback.set('');
  }

  chargerQuestionParCategorie() {
    const cat = this.selectedCategory();
    if (!cat) return;

    this.feedback.set('');
    this.selectedAnswer.set('');

    // On utilise ton service spécialisé pour les catégories
    this.questionService.getRandomQuestionOfCategory(cat).subscribe((id) => {
      if (id) {
        this.currentId = id;

        // Charger le texte de la question
        this.questionService.getLabelForQuestion(id).subscribe((label) => {
          this.currentQuestionLabel.set(label);
        });

        // Charger les réponses mélangées
        this.questionService.getRandomizedAnswersForQuestion(id).subscribe((answers) => {
          this.currentAnswers.set(answers);
        });
      }
    });
  }

  // La fonction pour vérifier les réponses
  verifierReponse() {
    if (!this.selectedAnswer()) return;

    // On utilise ton service pour vérifier (on suppose ici qu'on est en français)
    this.questionService.getQuestions().subscribe((questions) => {
      const q = questions.find((item) => item.question_id === this.currentId);
      if (q) {
        const estBon = this.questionService.isCorrect(q, this.selectedAnswer(), 'fr');
        this.feedback.set(
          estBon
            ? '✅ Bonne réponse !'
            : `❌ Erreur. La réponse était : ${q.correct_answer_french}`,
        );
      }
    });
  }
}
