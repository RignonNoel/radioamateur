import { Injectable } from '@angular/core';

interface QuestionExamState {
  [question_id: string]: string; // questionId -> réponse sélectionnée
}

export interface ExamState {
  questions: QuestionExamState;
  score: number;
}

@Injectable({
  providedIn: 'root',
})
export class PracticeExam {
  localStorageKey = 'currentExam'; // Public par défaut, accessible partout

  constructor() {
    this.testService();
  }

  // A supprimer ainsi que sur la page exam-generator///
  testService() {
    console.log('--- DÉBUT DU TEST ---');

    // 1. On démarre un examen vide
    this.startNewExam(10, ['B-001', 'B-002']);
    console.log('Examen initialisé :', this.getExamState());

    // 2. On ajoute une réponse pour tester la mise à jour
    const testId = 'B-001-001-001';
    const maReponse = 'La Loi sur la radiocommunication';
    this.updateAnswer(testId, maReponse);

    // 3. On récupère l'état pour vérifier si c'est bien stocké
    const stateApresUpdate = this.getExamState();
    console.log('État après mise à jour :', stateApresUpdate);

    if (stateApresUpdate?.questions[testId] === maReponse) {
      console.log('✅ SUCCÈS : La réponse a été correctement stockée !');
    } else {
      console.error("❌ ÉCHEC : La réponse n'est pas la bonne ou est absente.");
    }
  } ///SUPPRIMER///

  // Logique pour démarrer un nouvel examen avec le nombre de questions et les catégories sélectionnées
  startNewExam(numberOfQuestions: number, categories: string[]) {
    console.log(
      `Démarrage d'un nouvel examen avec ${numberOfQuestions} questions dans les catégories: ${categories.join(', ')}`,
    );
    const initialState: ExamState = {
      questions: {},
      score: 0,
    };

    this.saveExamState(initialState);
  }

  // Logique pour sauvegarder la réponse de l'utilisateur
  saveExamState(state: ExamState): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(state));
  }

  //Récupère l'état sauvegardé (Conversion String JSON -> Objet)
  getExamState(): ExamState | null {
    const saved = localStorage.getItem(this.localStorageKey);
    return saved ? JSON.parse(saved) : null;
  }

  //Met à jour une seule réponse sans effacer le reste
  updateAnswer(question_id: string, answer: string): void {
    const currentState = this.getExamState();
    if (currentState) {
      currentState.questions[question_id] = answer;
      this.saveExamState(currentState);
    }
  }

  /// Si question on retourne la réponse, sinon null
  getSavedAnswerForQuestion(question_id: string): string | null {
    const state = this.getExamState();

    if (state && state.questions && state.questions[question_id]) {
      return state.questions[question_id];
    }

    return null;
  }
}
