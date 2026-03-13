import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ServiceQuestions {
  constructor() {}

  getRandomQuestion(): string {
    // todo: get a random question from the JSON file (return the ID of the question)

    return '';
  }

  getRandomQuestionOfCategory(categoryName: string): string {
    // todo: get a random question of the given category from the JSON file (return the ID of the question)

    return '';
  }

  checkAnswer(questionId: string, answer: string): boolean {
    // todo: check if the given answer is correct for the question with the given ID

    return true;
  }

  getLabelForQuestion(questionId: string): string {
    // todo: get the label for the question with the given ID from the JSON file

    return '';
  }

  getRandomizedAnswersForQuestion(questionId: string): string[] {
    // todo: get the answers for the question with the given ID and randomize their order

    return ['answer1', 'answer2', 'answer3', 'answer4'];
  }
}
