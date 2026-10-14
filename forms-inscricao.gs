/**
 * Cria o forms de inscrição do Encontro Selfcare 3 anos no Google Forms.
 *
 * Como usar (uma vez só):
 * 1. Acesse https://script.google.com com a conta do Selfcare e clique em "Novo projeto".
 * 2. Apague o que estiver lá, cole este arquivo inteiro e preencha as 4 constantes abaixo.
 * 3. Clique em "Executar" (função criarForms) e autorize o acesso.
 * 4. Os links do forms aparecem em "Registro de execução". O forms também fica no seu Google Drive.
 */

const DATA_EVENTO = '20 de novembro'; // trocar pela data confirmada em 25/10
const CHAVE_PIX = '[chave Pix]';
const WHATSAPP_COMPROVANTE = '[WhatsApp para comprovante]';
const HORARIO = 'das 9h às 15h'; // ajustar

function criarForms() {
  const form = FormApp.create('Encontro Selfcare 3 anos · Inscrição');
  form.setDescription(
    'Um dia inteiro de autocuidado para celebrar os 3 anos do Selfcare by Pri Buiar.\n\n' +
    'Quando: ' + DATA_EVENTO + ', ' + HORARIO + '\n' +
    'Onde: Villa Morena, Rio de Janeiro\n' +
    'Programação: yoga, pintura em cerâmica, café da manhã e trocas\n\n' +
    'Participação: R$ 50, pagos via Pix (' + CHAVE_PIX + ').\n' +
    'Todo o lucro do encontro vai para o Instituto da Criança.\n\n' +
    'Não pode vir? Você ainda pode amadrinhar uma participante ou doar para o Instituto.'
  );
  form.setCollectEmail(true);
  form.setProgressBar(true);

  // Página 1: dados e tipo de participação
  form.addTextItem().setTitle('Nome completo').setRequired(true);
  form.addTextItem().setTitle('WhatsApp (com DDD)').setRequired(true);
  form.addTextItem().setTitle('@ do Instagram');

  const tipo = form.addMultipleChoiceItem()
    .setTitle('Como você vai participar?')
    .setHelpText('Escolha uma opção. Só as duas primeiras são presenciais.')
    .setRequired(true);

  // Página 2: só para quem vem
  const pgPresencial = form.addPageBreakItem().setTitle('Sua participação presencial');
  form.addParagraphTextItem().setTitle('Tem alguma restrição alimentar ou alergia?');
  form.addMultipleChoiceItem()
    .setTitle('Autoriza o uso da sua imagem nas fotos e vídeos do encontro?')
    .setChoiceValues(['Sim', 'Não'])
    .setRequired(true);
  form.addMultipleChoiceItem()
    .setTitle('Como você conheceu o Selfcare?')
    .setChoiceValues(['Instagram da Pri', 'Instagram do Selfcare', 'Indicação de amiga', 'Plataforma Selfcare'])
    .showOtherOption(true);

  // Página 3: só para quem não vem
  const pgDoacao = form.addPageBreakItem().setTitle('Sua doação');
  form.addTextItem().setTitle('Cidade, estado e país').setRequired(true);
  form.addParagraphTextItem()
    .setTitle('Quer deixar uma mensagem?')
    .setHelpText('Se você amadrinhou uma participante, ela vai receber o seu carinho no dia.');

  // Página 4: pagamento (todas passam aqui)
  const pgPagamento = form.addPageBreakItem()
    .setTitle('Pagamento')
    .setHelpText('Pix: ' + CHAVE_PIX + '\nDepois de pagar, envie o comprovante para o WhatsApp ' + WHATSAPP_COMPROVANTE + '.');
  form.addTextItem()
    .setTitle('Valor total que você enviou (R$)')
    .setHelpText('Presencial: R$ 50. Presencial com doação: R$ 50 + o valor extra.')
    .setValidation(FormApp.createTextValidation().requireNumber().build())
    .setRequired(true);
  form.addCheckboxItem()
    .setTitle('Confirmação')
    .setChoiceValues(['Fiz o Pix e vou enviar o comprovante pelo WhatsApp'])
    .setRequired(true);

  // Navegação: presencial vai para a página 2; doação pula para a página 3.
  // Quem termina a página 2 pula a página 3 e vai direto para o pagamento.
  tipo.setChoices([
    tipo.createChoice('A · Vou presencialmente (R$ 50)', pgPresencial),
    tipo.createChoice('B · Vou presencialmente e quero doar um valor extra', pgPresencial),
    tipo.createChoice('C · Não vou, mas quero amadrinhar uma participante (R$ 50 ou mais)', pgDoacao),
    tipo.createChoice('D · Não vou, só quero doar para o Instituto da Criança (valor livre)', pgDoacao),
  ]);
  pgDoacao.setGoToPage(pgPagamento);

  form.setConfirmationMessage(
    'Inscrição recebida! Assim que o comprovante chegar no WhatsApp, a gente confirma por lá. Obrigada por fazer parte 💛'
  );

  Logger.log('Link para divulgar: ' + form.getPublishedUrl());
  Logger.log('Link para editar: ' + form.getEditUrl());
}
