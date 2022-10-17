export function getPipelineMessage(pipeline) {
  const { project, object_attributes } = pipeline;
  const format = { parse_mode: "MarkdownV2" };

  console.log(pipeline);
  const message = `
  🚀🚀 Deploying project [${project.path_with_namespace}](${project.web_url}) 🚀🚀

  Ref: *${object_attributes.ref}*
  `;

  return { message, format };
}
