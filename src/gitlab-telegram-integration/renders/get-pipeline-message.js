export function getPipelineMessage(pipeline) {
  const { project, object_attributes } = pipeline;
  const format = { parse_mode: "MarkdownV2" };

  const message = `
  Deploying project [${project.web_url}](${project.path_with_namespace})
  Ref: *${object_attributes.ref}*
  `;

  return { message, format };
}
