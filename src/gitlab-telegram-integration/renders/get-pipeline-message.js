export function getPipelineMessage(pipeline) {
  const { project, object_attributes } = pipeline;

  const message = `\
  Deploying project <a href="${project.web_url}">${project.path_with_namespace}</a>
  Ref: <b>${object_attributes.ref}</b>
  `;

  return message;
}
