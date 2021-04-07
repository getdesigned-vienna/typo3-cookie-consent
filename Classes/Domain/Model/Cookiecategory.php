<?php

namespace GD\Cookieconsent\Domain\Model;

use TYPO3\CMS\Extbase\DomainObject\AbstractEntity;

/**
 * Class Cookiecategory
 * @since 1.0.0
 */
class Cookiecategory extends AbstractEntity
{

    /**
     * @var string
     */
    protected $name;

    /**
     * @var string
     */
    protected $description;

    /**
     * @var boolean
     */
    protected $forced;

    /**
     * @var \TYPO3\CMS\Extbase\Persistence\ObjectStorage<\GD\Cookieconsent\Domain\Model\Script>
     */
    protected $scripts;

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @param string $name
     */
    public function setName(string $name): void
    {
        $this->name = $name;
    }

    /**
     * @return string
     */
    public function getDescription(): string
    {
        return $this->description;
    }

    /**
     * @param string $description
     */
    public function setDescription(string $description): void
    {
        $this->description = $description;
    }

    /**
     * @return bool
     */
    public function isForced(): bool
    {
        return $this->forced;
    }

    /**
     * @param bool $forced
     */
    public function setForced(bool $forced): void
    {
        $this->forced = $forced;
    }

    /**
     * @return \TYPO3\CMS\Extbase\Persistence\ObjectStorage<\GD\Cookieconsent\Domain\Model\Script>
     */
    public function getScripts(): \TYPO3\CMS\Extbase\Persistence\ObjectStorage
    {
        return $this->scripts;
    }

    /**
     * @param \TYPO3\CMS\Extbase\Persistence\ObjectStorage<\GD\Cookieconsent\Domain\Model\Script> $scripts
     */
    public function setScripts(\TYPO3\CMS\Extbase\Persistence\ObjectStorage $scripts): void
    {
        $this->scripts = $scripts;
    }

    /**
     * @param \GD\Cookieconsent\Domain\Model\Script $script
     */
    public function addScript(\GD\Cookieconsent\Domain\Model\Script $script): void
    {
        $this->scripts->attach($script);
    }

}