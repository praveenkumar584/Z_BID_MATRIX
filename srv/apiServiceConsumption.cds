service apiServiceConsumption
{
  function getAribaData(eventId: String) returns String;
  action getTemplateFile(eventId: String) returns LargeString;
}