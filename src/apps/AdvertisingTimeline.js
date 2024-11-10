import React, { useState, useRef, useEffect } from 'react';
import './AdvertisingTimeline.css'; // Import app-specific styles
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenNib, faNetworkWired, faGlobe, faTv, faTag, faCamera, faRobot } from '@fortawesome/free-solid-svg-icons';
import { useSwipeable } from 'react-swipeable';
import FocusLock from 'react-focus-lock';  // Focus management library


// Images
import img1960s from './images/1960sad.webp';
import img1990s from './images/1990sad.avif';
import img2000s from './images/2000sad.jpg';
import img2010s from './images/2010sad.png';


const timelineData = [
    {
        decade: '1960s',
        title: 'The birth of the creative revolution',
        description: 'The rise of creative-driven advertising, focusing on wit and storytelling. Madison Avenue agencies changed the landscape by prioritising creativity over hard-sell tactics.',
        exampleAd: 'Volkswagen\'s \'Think Small\' (1960)',
        impact: 'This minimalist ad revolutionised car advertising by emphasising simplicity and irony.',
        icon: () => <FontAwesomeIcon icon={faPenNib} />,        
        image: img1960s,
        alt: 'Volkswagen’s minimalist Think Small ad from the 1960s'
    },
    {
        decade: '1970s',
        title: 'The power of branding',
        description: 'A shift from selling products to building brand identities. Brands began focusing on emotional connections and lifestyle imagery.',
        exampleAd: 'Coca-Cola\'s \'I\'d Like to Buy the World a Coke\' (1971)',
        impact: 'This ad showcased a message of unity and peace, associating Coca-Cola with positive, uplifting emotions.',
        icon: () => <FontAwesomeIcon icon={faTag} />,        
        youtubeVideo: 'https://www.youtube.com/embed/ib-Qiyklq-Q',  // YouTube video link
        videoTitle: 'Coca-Cola’s “I’d Like to Buy the World a Coke” ad from the 1970s'
    },
    {
        decade: '1980s',
        title: 'Big budget, big ideas and the rise of tv commercials',
        description: 'Television became the dominant medium for advertising. Increased ad budgets led to more dramatic, story-driven TV commercials.',
        exampleAd: 'Apple\'s \'1984\' Super Bowl Ad (1984)',
        impact: 'Introduced the Macintosh computer and portrayed Apple as a rebel challenging the status quo.',
        icon: () => <FontAwesomeIcon icon={faTv} />,        
        youtubeVideo: 'https://www.youtube.com/embed/VtvjbmoDx-I',  // Apple 1984 ad
        videoTitle: 'Apple’s 1984 Super Bowl Ad introducing the Macintosh'
    },
    {
        decade: '1990s',
        title: 'Digital beginnings in advertising',
        description: 'The rise of early digital ads with the emergence of the internet. The first digital banner ad launched by AT&T in 1994 on HotWired.',
        exampleAd: 'AT&T’s first banner ad (1994)',
        impact: 'This banner ad marked the birth of online advertising, creating a foundation for future digital marketing.',
        icon: () => <FontAwesomeIcon icon={faGlobe} />,        
        image: img1990s,
        alt: 'AT&T’s first banner ad on HotWired in the 1990s'
    },
    {
        decade: '2000s',
        title: 'The rise of digital and guerrilla marketing',
        description: 'The explosion of digital marketing and guerrilla tactics. Brands increasingly invested in online campaigns, viral marketing and guerrilla strategies.',
        exampleAd: 'Burger King\'s \'Subservient Chicken\' (2004)',
        impact: 'This online campaign allowed users to \'control\' a chicken via a website, pioneering interactive and viral marketing.',
        icon: () => <FontAwesomeIcon icon={faNetworkWired} />,        
        image: img2000s,
        alt: 'Burger King’s Subservient Chicken campaign in the 2000s'
    },
    {
        decade: '2010s',
        title: 'The rise of influencer marketing',
        description: 'The dominance of social media and influencers as brands shifted their marketing budgets to platforms like Instagram.',
        exampleAd: 'Daniel Wellington Instagram Influencer Campaign',
        impact: 'Daniel Wellington became a major watch brand by giving influencers free watches in exchange for social media posts, setting a standard for influencer-driven marketing.',
        icon: () => <FontAwesomeIcon icon={faCamera} />,        
        image: img2010s,
        alt: 'Daniel Wellington’s Instagram influencer campaign in the 2010s'
    },
    {
        decade: '2020s',
        title: 'Personalisation, AI and the power of data',
        description: 'The rise of AI-driven, data-fueled personalized marketing.',
        exampleAd: 'Coca-Cola \'Create Real Magic\' AI-powered campaign (2023)',
        impact: 'Coca-Cola’s use of AI in this campaign has redefined how brands interact with consumers, encouraging them to create personalized digital art with Coca-Cola’s assets using advanced AI tools.',
        icon: () => <FontAwesomeIcon icon={faRobot} />,        
        youtubeVideo: 'https://www.youtube.com/embed/YDGknvJ55Ag',  // Coca-Cola Real Magic AI Campaign video (embed link)
        videoTitle: 'Coca-Cola’s “Create Real Magic” AI-powered campaign from the 2020s'
    },
];

const ImageModal = ({ isOpen, onClose, imageSrc, alt }) => {
    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            onClose();
        }
    };

    return (
        <FocusLock>
            <div
                className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 modal-overlay"
                onClick={handleOverlayClick}
                aria-modal="true"
                role="dialog"
            >
                <div className="relative max-w-4xl max-h-screen p-4">
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-1"
                        aria-label="Close image modal"
                    >
                        <X size={24} />
                    </button>
                    <img src={imageSrc} alt={alt} className="max-w-full max-h-[90vh] object-contain" />
                </div>
            </div>
        </FocusLock>
    );
};


const AdvertisingTimeline = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const buttonRef = useRef(null);
    const contentRef = useRef(null);

    // Ensure focus stays on updated content


    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
        contentRef.current.focus();
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex < timelineData.length - 1 ? prevIndex + 1 : prevIndex));
        contentRef.current.focus();
    };

    const handleDecadeSelect = (index) => {
        setCurrentIndex(index);
        contentRef.current.focus();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'ArrowRight') handleNext();
    };

    const handlers = useSwipeable({
        onSwipedLeft: handleNext,
        onSwipedRight: handlePrev,
        preventDefaultTouchmoveEvent: true,
        trackMouse: false,
        trackTouch: true
    });

    const currentEra = timelineData[currentIndex];

    return (
        <section
            {...handlers}
            onKeyDown={handleKeyDown}
            tabIndex="0"
            className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-200 flex flex-col items-center justify-start p-8"
            aria-labelledby="timeline-heading"
        >

            <header>
                <h1 id="timeline-heading" className="text-3xl font-bold text-gray-800 mb-12">
                    The evolution of creativity through the decades
                </h1>


            </header>
    
            <nav id="decade-navigation" role="tablist" aria-label="Decade navigation">
                <div className="hidden md:flex md:flex-wrap md:justify-center gap-6 mb-8">
                    {timelineData.map((era, index) => (
                        <button
                            key={era.decade}
                            className={`w-24 h-24 bg-white rounded-xl shadow-lg flex flex-col items-center justify-center transition-all duration-300 ${index === currentIndex ? 'ring-4 ring-blue-500' : 'hover:bg-blue-200 hover:text-white hover:scale-105'}`}
                            onClick={() => handleDecadeSelect(index)}
                            aria-selected={index === currentIndex}
                            role="tab"
                            id={`tab-${era.decade}`}
                            aria-controls={`panel-${era.decade}`}
                        >
                            <era.icon className={`w-8 h-8 ${index === currentIndex ? 'text-blue-500' : 'text-gray-700'}`} />
                            <span className="mt-2 text-sm font-semibold text-gray-800">{era.decade}</span>
                        </button>
                    ))}
                </div>
            </nav>
    
            <section id="decade-content" role="tabpanel" aria-labelledby={`tab-${currentEra.decade}`} ref={contentRef} tabIndex="-1">
                <div className="relative p-1 rounded-lg bg-blue-300">
                    <div
                        className="p-6 bg-white rounded-lg shadow-xl max-w-4xl w-full border-4 border-dashed border-transparent bg-clip-padding"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <button
                                onClick={handlePrev}
                                disabled={currentIndex === 0}
                                className={`p-2 rounded-full transition-colors duration-300 ${currentIndex === 0 ? 'bg-gray-200 text-gray-400' : 'bg-gray-200 hover:bg-blue-500 hover:text-white'}`}
                                aria-label={`Go to the previous decade`}
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
    
                            <h2
                                className="text-xl font-bold text-center text-gray-800"
                            >
                                {currentEra.decade}
                            </h2>
    
                            <button
                                onClick={handleNext}
                                disabled={currentIndex === timelineData.length - 1}
                                className={`p-2 rounded-full transition-colors duration-300 ${currentIndex === timelineData.length - 1 ? 'bg-gray-200 text-gray-400' : 'bg-gray-200 hover:bg-blue-500 hover:text-white'}`}
                                aria-label={`Go to the next decade`}
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
    
                        <div className="flex flex-col md:flex-row md:space-x-6 w-full max-w-4xl mx-auto">
                            <section className="w-full md:w-1/2 lg:w-1/2 mb-6 md:mb-0">
                                <p className="text-gray-600 font-semibold">{currentEra.title}</p>
                                <p className="text-gray-600">{currentEra.description}</p>
                                <div>
                                    <p className="text-gray-600 font-semibold">Example ad:</p>
                                    <p className="text-gray-600">{currentEra.exampleAd}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600 font-semibold">Impact:</p>
                                    <p className="text-gray-600">{currentEra.impact}</p>
                                </div>
                            </section>
    
                            <section className="w-full md:w-1/2 lg:w-1/2 flex justify-center items-center bg-gray-100 p-4 rounded-lg">
                                {currentEra.youtubeVideo ? (
                                    <div className="video-container w-full">
                                        <div className="relative pb-[56.25%] h-0">
                                            <iframe
                                                className="absolute top-0 left-0 w-full h-full"
                                                src={currentEra.youtubeVideo}
                                                title={currentEra.videoTitle}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className="cursor-pointer w-full h-full flex justify-center items-center"
                                        onClick={() => setIsModalOpen(true)}
                                        ref={buttonRef}
                                        role="button"
                                        aria-label={`Open image of ${currentEra.alt}`}
                                    >
                                        <img
                                            src={currentEra.image}
                                            alt={currentEra.alt}
                                            className="max-w-full max-h-[280px] object-contain"
                                        />
                                    </div>
                                )}
                            </section>

                            {currentEra.image && (
                                <ImageModal
                                    isOpen={isModalOpen}
                                    onClose={() => {
                                        setIsModalOpen(false);
                                        buttonRef.current?.focus();
                                    }}
                                    imageSrc={currentEra.image}
                                    alt={`Full size advertising in the ${currentEra.decade}`}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </section>
    );
};

export default AdvertisingTimeline;
