import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>

        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>

          {/* Career 1 */}
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Junior Web Developer</h4>
                <h5>Self Learning & Personal Projects</h5>
              </div>
              <h3>2016</h3>
            </div>
            <p>
              Started my programming journey in school. Built small web
              projects using HTML, CSS, JavaScript and PHP while learning
              core programming concepts and backend basics.
            </p>
          </div>

          {/* Career 2 */}
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Freelance Web Developer</h4>
                <h5>Independent Projects</h5>
              </div>
              <h3>2019</h3>
            </div>
            <p>
              Developed multiple web applications and backend systems.
              Worked with React.js, PHP, APIs, and MySQL to build responsive
              websites and automation tools.
            </p>
          </div>

          {/* Career 3 */}
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Full Stack Developer</h4>
                <h5>Freelance & Open Source</h5>
              </div>
              <h3>Present</h3>
            </div>
            <p>
              Building scalable web applications, Telegram bots, APIs and
              automation systems using React.js, JavaScript, PHP, Node.js and
              Cloudflare Workers. Focused on performance, security and
              production-ready deployments.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Career;