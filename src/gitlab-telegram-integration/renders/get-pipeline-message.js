export function getPipelineMessage(pipeline) {
  const { project, object_attributes } = pipeline;

  const message = `\
    Deploying project [${project.path_with_namespace}](${project.web_url})\n
    Ref: *${object_attributes.ref}*
  `;
  return message;
}
