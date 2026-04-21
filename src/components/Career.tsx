import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          Education <span>&</span>
          <br /> experience
        </h2>

        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>

          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>MPhil Researcher</h4>
                <h5>University of New South Wales</h5>
              </div>
              <h3>2025</h3>
            </div>
            <p>
              Pursuing a Master of Philosophy in Computer Science and
              Engineering in Sydney, Australia, advised by Dr. Jiaojiao Jiang.
              Research focuses on machine learning, generative models, and AI
              security.
            </p>
          </div>

          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Undergraduate Researcher</h4>
                <h5>City University of Macau</h5>
              </div>
              <h3>2023</h3>
            </div>
            <p>
              Developed G-RXAD, a deep reinforcement learning-based attack
              detection model for network security, later published at AICIT
              2024.
            </p>
          </div>

          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Bachelor of Data Science</h4>
                <h5>City University of Macau</h5>
              </div>
              <h3>2021</h3>
            </div>
            <p>
              Completed undergraduate study in Data Science in Macau, China,
              building a foundation in machine learning, data-driven systems,
              and applied AI research.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Career;
