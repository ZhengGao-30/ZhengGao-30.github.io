import "./styles/About.css";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">About Me</h3>
        <p className="para">
          I am an MPhil researcher in Computer Science and Engineering at the
          University of New South Wales, advised by Dr. Jiaojiao Jiang. My work
          focuses on machine learning, AI security, and applied deep learning.
        </p>
        <p className="para">
          I am particularly interested in generative model watermarking,
          watermark removal attacks, deepfake detection and localization, robust
          graph learning, computer vision, natural language processing, and
          large language models.
        </p>
      </div>
    </div>
  );
};

export default About;
