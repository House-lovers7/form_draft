// Code.ts - サーバーサイドのメイン処理

// フォームデータの型定義
// 選択肢の型
interface FormOption {
    id: string;
    value: string;
  }
  
  // 質問タイプの列挙型
  enum QuestionType {
    TEXT = 'TEXT',
    RADIO = 'RADIO',
    LIST = 'LIST'
  }
  
  // 基本質問インターフェース
  interface BaseQuestion {
    id: string;
    title: string;
    type: QuestionType;
    required: boolean;
    helpText?: string;
    pageBreak?: boolean;
  }
  
  // テキスト質問
  interface TextQuestion extends BaseQuestion {
    type: QuestionType.TEXT;
  }
  
  // 条件付き質問の型
  interface ConditionalQuestions {
    [optionId: string]: Question[];
  }
  
  // 選択式質問（ラジオ/リスト共通プロパティ）
  interface ChoiceQuestion extends BaseQuestion {
    options: FormOption[];
    conditionalQuestions?: ConditionalQuestions;
  }
  
  // ラジオボタン質問
  interface RadioQuestion extends ChoiceQuestion {
    type: QuestionType.RADIO;
  }
  
  // リスト質問
  interface ListQuestion extends ChoiceQuestion {
    type: QuestionType.LIST;
  }
  
  // 質問タイプの共用体
  type Question = TextQuestion | RadioQuestion | ListQuestion;
  
  // フォームデータの型
  interface FormData {
    id?: string;
    title: string;
    description: string;
    themeColor: string;
    confirmationMessage?: string;
    showAnswerSummary?: boolean;
    questions: Question[];
  }
  
  // フォームページの型
  interface FormPage {
    questions: Question[];
    parentQuestion?: string;
    parentOption?: string;
  }
  
  // 条件マッピングの型
  type ConditionalMapping = Record<string, Record<string, number>>;
  
  // 処理結果の型
  interface ProcessResult {
    success: boolean;
    error?: string;
    formId?: string;
    viewUrl?: string;
    editUrl?: string;
    timestamp?: string;
    questions?: Question[];
    answers?: Record<string, string | string[]>;
  }
  
  /**
   * フォームエディタを表示するためのWebアプリケーション
   */
  function doGet(e: GoogleAppsScript.Events.DoGet): GoogleAppsScript.HTML.HtmlOutput {
    const action = e.parameter?.action || 'edit';
    
    if (action === 'edit') {
      return showFormEditor();
    } else if (action === 'view') {
      const formId = e.parameter?.formId;
      if (formId) {
        return showFormView(formId);
      }
    } else if (action === 'preview') {
      const formId = e.parameter?.formId;
      if (formId) {
        return showFormPreview(formId);
      }
    }
    
    // デフォルトはフォームエディタを表示
    return showFormEditor();
  }
  
  /**
   * フォーム送信を処理するためのWebアプリケーション
   */
  function doPost(e: GoogleAppsScript.Events.DoPost): GoogleAppsScript.Content.TextOutput {
    const formId = e.parameter?.formId as string;
    let formData: Record<string, string | string[]> = {};
    
    try {
      formData = JSON.parse(e.postData?.contents || '{}');
      const result = saveFormResponse(formId, formData);
      return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.toString() : '不明なエラー';
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: errorMessage }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  /**
   * フォームエディタUIを表示
   */
  function showFormEditor(): GoogleAppsScript.HTML.HtmlOutput {
    const template = HtmlService.createTemplateFromFile('form-editor');
    const html = template.evaluate();
    html.setTitle('動的フォームエディタ');
    html.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    return html;
  }
  
  /**
   * フォーム回答画面を表示
   */
  function showFormView(formId: string): GoogleAppsScript.HTML.HtmlOutput {
    // フォームデータを取得
    const formData = getFormById(formId);
    
    if (!formData) {
      return HtmlService.createHtmlOutput('<h1>フォームが見つかりません</h1>')
        .setTitle('エラー');
    }
    
    // フォームデータをテンプレートに設定
    const template = HtmlService.createTemplateFromFile('form-response');
    template.formData = formData;
    template.formSubmitUrl = ScriptApp.getService().getUrl() + '?formId=' + formId;
    
    // フォームのページ分割と条件付き質問のマッピングを処理
    const { formPages, conditionalMapping } = preprocessFormData(formData);
    template.formPages = formPages;
    template.conditionalMapping = conditionalMapping;
    
    const html = template.evaluate();
    html.setTitle(formData.title);
    html.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    return html;
  }
  
  /**
   * フォームのプレビューを表示
   */
  function showFormPreview(formId: string): GoogleAppsScript.HTML.HtmlOutput {
    return showFormView(formId);
  }
  
/**
 * フォームデータのプリプロセス（ページ分割と条件付き質問のマッピング）
 */
function preprocessFormData(formData: FormData): { formPages: FormPage[], conditionalMapping: ConditionalMapping } {
    const formPages: FormPage[] = [];
    const conditionalMapping: ConditionalMapping = {};
    
    // 最初のページを作成
    let currentPage: FormPage = {
      questions: []
    };
    
    // 通常の質問をページに追加
    formData.questions.forEach((question: Question) => {
      // このページが分割されるかどうかを確認
      if (question.pageBreak) {
        // 現在のページを保存
        formPages.push(currentPage);
        
        // 新しいページを作成
        currentPage = {
          questions: []
        };
      }
      
      // 質問をページに追加
      currentPage.questions.push(question);
      
      // 条件付き質問のマッピングを作成
      if ((question.type === QuestionType.RADIO || question.type === QuestionType.LIST) &&
          question.conditionalQuestions) {
        conditionalMapping[question.id] = {};
        
        Object.keys(question.conditionalQuestions).forEach((optionId: string) => {
          // 新しいページインデックスを計算
          const conditionalPageIndex = formPages.length + 1;
          conditionalMapping[question.id][optionId] = conditionalPageIndex;
          
          // 条件付き質問用の新しいページを作成
          const conditionalQuestions = question.conditionalQuestions?.[optionId]; // オプショナルチェイニングを使用
          if (conditionalQuestions && conditionalQuestions.length > 0) {
            formPages.push({
              questions: conditionalQuestions,
              parentQuestion: question.id,
              parentOption: optionId
            });
          }
        });
      }
    });
    
    // 最後のページを追加
    formPages.push(currentPage);
    
    return { formPages, conditionalMapping };
  }
  
  /**
   * フォームデータを取得
   */
  function getFormData(): FormData {
    // 保存されているフォームデータを取得
    const userProperties = PropertiesService.getUserProperties();
    const formDataStr = userProperties.getProperty('currentForm');
    
    if (formDataStr) {
      return JSON.parse(formDataStr) as FormData;
    } else {
      // デフォルトのフォームデータを返す
      return {
        title: '無題のフォーム',
        description: '',
        themeColor: '#673ab7',
        questions: [
          {
            id: 'q_' + Math.random().toString(36).substr(2, 9),
            title: '質問',
            type: QuestionType.RADIO,
            required: false,
            options: [
              { id: 'opt_' + Math.random().toString(36).substr(2, 9), value: 'オプション 1' },
              { id: 'opt_' + Math.random().toString(36).substr(2, 9), value: 'オプション 2' }
            ]
          } as RadioQuestion // 型アサーションで明示的にRadioQuestion型であることを示す
        ]
      };
    }
  }
  
  /**
   * IDでフォームを取得
   */
  function getFormById(formId: string): FormData | null {
    const userProperties = PropertiesService.getUserProperties();
    const formDataStr = userProperties.getProperty('form_' + formId);
    
    if (formDataStr) {
      return JSON.parse(formDataStr) as FormData;
    }
    
    return null;
  }
  
  /**
   * フォームデータを保存
   */
  function saveFormData(formData: FormData): ProcessResult {
    try {
      // フォームにIDがない場合は生成
      if (!formData.id) {
        formData.id = 'form_' + Math.random().toString(36).substr(2, 9);
      }
      
      // フォームデータを保存
      const userProperties = PropertiesService.getUserProperties();
      userProperties.setProperty('currentForm', JSON.stringify(formData));
      userProperties.setProperty('form_' + formData.id, JSON.stringify(formData));
      
      // 成功結果を返す
      return {
        success: true,
        formId: formData.id,
        viewUrl: ScriptApp.getService().getUrl() + '?action=view&formId=' + formData.id,
        editUrl: ScriptApp.getService().getUrl() + '?action=edit&formId=' + formData.id
      };
    } catch (error) {
      // エラー情報を返す
      const errorMessage = error instanceof Error ? error.toString() : '不明なエラー';
      return {
        success: false,
        error: errorMessage
      };
    }
  }
  
  /**
   * フォームの回答を保存
   */
  function saveFormResponse(formId: string, responseData: Record<string, string | string[]>): ProcessResult {
    try {
      // フォームデータを取得
      const formData = getFormById(formId);
      
      if (!formData) {
        throw new Error('フォームが見つかりません');
      }
      
      // スプレッドシートにデータを保存
      const spreadsheetId = getOrCreateResponseSpreadsheet(formId, formData);
      
      // タイムスタンプを追加
      const timestamp = new Date().toISOString();
      
      // 回答データを整形
      const responseValues = formatResponseData(formData, responseData, timestamp);
      
      // スプレッドシートに書き込み
      const sheet = SpreadsheetApp.openById(spreadsheetId).getSheets()[0];
      sheet.appendRow(responseValues);
      
      // 成功結果を返す
      return {
        success: true,
        timestamp: timestamp,
        questions: formData.questions,
        answers: responseData
      };
    } catch (error) {
      // エラー情報を返す
      const errorMessage = error instanceof Error ? error.toString() : '不明なエラー';
      return {
        success: false,
        error: errorMessage
      };
    }
  }
  
  /**
   * 回答保存用のスプレッドシートを取得または作成
   */
  function getOrCreateResponseSpreadsheet(formId: string, formData: FormData): string {
    const userProperties = PropertiesService.getUserProperties();
    let spreadsheetId = userProperties.getProperty('spreadsheet_' + formId);
    
    if (!spreadsheetId) {
      // 新しいスプレッドシートを作成
      const spreadsheet = SpreadsheetApp.create(formData.title + ' (回答)');
      spreadsheetId = spreadsheet.getId();
      
      // スプレッドシートIDを保存
      userProperties.setProperty('spreadsheet_' + formId, spreadsheetId);
      
      // ヘッダー行を追加
      const headerRow = ['タイムスタンプ'];
      formData.questions.forEach((question: Question) => {
        headerRow.push(question.title);
      });
      
      spreadsheet.getSheets()[0].appendRow(headerRow);
    }
    
    return spreadsheetId;
  }
  
  /**
   * 回答データをスプレッドシート用に整形
   */
  function formatResponseData(
    formData: FormData, 
    responseData: Record<string, string | string[]>, 
    timestamp: string
  ): (string | undefined)[] {
    const responseValues: (string | undefined)[] = [timestamp];
    
    formData.questions.forEach((question: Question) => {
      const response = responseData[question.id];
      
      if (response) {
        if (Array.isArray(response)) {
          // 複数値の場合、カンマ区切りで結合
          responseValues.push(response.join(', '));
        } else {
          responseValues.push(response);
        }
      } else {
        // 回答がない場合は空を追加
        responseValues.push(undefined);
      }
    });
    
    return responseValues;
  }
  
  /**
   * フォーム回答を送信
   */
  function submitFormResponse(responseData: Record<string, string | string[]>): ProcessResult {
    try {
      // URLからフォームIDを取得
      const formId = getFormIdFromUrl();
      
      if (!formId) {
        throw new Error('フォームIDが見つかりません');
      }
      
      // フォーム回答を保存
      return saveFormResponse(formId, responseData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.toString() : '不明なエラー';
      return {
        success: false,
        error: errorMessage
      };
    }
  }
  
  /**
   * URLからフォームIDを取得
   */
  function getFormIdFromUrl(): string | null {
    const url = ScriptApp.getService().getUrl();
    const match = url.match(/[?&]formId=([^&]+)/);
    
    if (match && match[1]) {
      return match[1];
    }
    
    return null;
  }
  
  /**
   * アプリケーションを起動するメイン関数
   */
  function startApp(): void {
    const url = ScriptApp.getService().getUrl();
    Logger.log('アプリケーションURL: ' + url);
  }
