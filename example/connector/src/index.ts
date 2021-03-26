import { Octommit } from "octommit";

new Octommit("")
  .update()
  .org("")
  .repository("")
  .sourceBranch("")
  .outputBranch("")
  .sourcePath("")
  .outputPath("")
  .set("image.tag", "<repo>/<image>:>tag>")
  .commit("message")
  .run();
