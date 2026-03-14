import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Questions } from '../interfaces/questions';

@Injectable({
  providedIn: 'root',
})
export class ServiceQuestions {
  private jsonUrl = 'data/questions.json';

  constructor(private http: HttpClient) {}

  // Récupère la liste complète des questions
  getQuestions(): Observable<Questions[]> {
    return this.http.get<Questions[]>(this.jsonUrl);
  }

  // todo: get a random question from the JSON file (return the ID of the question)
  getRandomQuestionId(): Observable<string> {
    return this.getQuestions().pipe(
      map((questions: Questions[]) => {
        // On précise ici que c'est un tableau de Question
        if (!questions || questions.length === 0) return '';
        const randomIndex = Math.floor(Math.random() * questions.length);
        return questions[randomIndex].question_id;
      }),
    );
  }
  private readonly CATEGORY_MAP: { [key: string]: string } = {
    'B-001': 'Règlements et politiques',
    'B-002': 'Brouillage et interférence',
    'B-003': 'Exploitation et procédures',
    // Tu peux continuer la liste jusqu'à B-015 ici...
    'B-015': 'Antennes et lignes de transmission',
  };

  // todo: get a random question of the given category from the JSON file (return the ID of the question)
  getRandomQuestionOfCategory(categoryCode: string): Observable<string> {
    return this.getQuestions().pipe(
      map((questions: Questions[]) => {
        // On filtre par le code (ex: B-001)
        const filtered = questions.filter((q) => q.question_id.startsWith(categoryCode));

        if (!filtered || filtered.length === 0) {
          console.warn(`Aucune question trouvée pour la section ${categoryCode}`);
          return '';
        }

        const randomIndex = Math.floor(Math.random() * filtered.length);
        return filtered[randomIndex].question_id;
      }),
    );
  }

  // Fonction bonus pour récupérer le nom complet à partir du code
  getCategoryName(code: string): string {
    return this.CATEGORY_MAP[code] || 'Catégorie inconnue';
  }

  // todo: check if the given answer is correct for the question with the given ID
  isCorrect(question: Questions, answer: string, lang: 'fr' | 'en' = 'fr'): boolean {
    const correctAnswer =
      lang === 'fr' ? question.correct_answer_french : question.correct_answer_english;

    // On compare en étant tolérant sur les espaces (trim)
    return answer.trim() === correctAnswer.trim();
  }

  // todo: get the label for the question with the given ID from the JSON file
  getLabelForQuestion(questionId: string, lang: 'fr' | 'en' = 'fr'): Observable<string> {
    return this.getQuestions().pipe(
      map((questions) => {
        const question = questions.find((q) => q.question_id === questionId);
        if (!question) return '';
        return lang === 'fr' ? question.question_french : question.question_english;
      }),
    );
  }

  // todo: get the answers for the question with the given ID and randomize their order
  getRandomizedAnswersForQuestion(
    questionId: string,
    lang: 'fr' | 'en' = 'fr',
  ): Observable<string[]> {
    return this.getQuestions().pipe(
      map((questions) => {
        const question = questions.find((q) => q.question_id === questionId);
        if (!question) return [];

        // On prépare le tableau selon la langue
        const answers =
          lang === 'fr'
            ? [
                question.correct_answer_french,
                question.incorrect_answer_1_french,
                question.incorrect_answer_2_french,
                question.incorrect_answer_3_french,
              ]
            : [
                question.correct_answer_english,
                question.incorrect_answer_1_english,
                question.incorrect_answer_2_english,
                question.incorrect_answer_3_english,
              ];

        // Mélange (Algorithme de Fisher-Yates ou simple sort)
        return answers.sort(() => Math.random() - 0.5);
      }),
    );
  }
}
